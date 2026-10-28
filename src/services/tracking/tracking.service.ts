import { getDbConnection, sql } from "@/lib/db";
import { ClientInfo } from "@/lib/tracking/detector";

export interface TrackPayload {
  action: "session_start" | "page_enter" | "ping" | "page_leave" | "section_view";
  sessionId: string;
  visitorId: string;
  viewId?: string | null;
  pagePath?: string | null;
  pageTitle?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  durationSeconds?: number;
  incrementalSeconds?: number;
  maxScrollPercent?: number;
  sections?: Array<{
    sectionId: string;
    timeVisibleSeconds: number;
  }>;
}

export class TrackingService {
  /**
   * Ingest a tracking payload and update sessions, page views, and section views
   */
  public static async processEvent(payload: TrackPayload, clientInfo: ClientInfo): Promise<boolean> {
    // Drop bot events silently
    if (clientInfo.isBot) {
      return false;
    }

    const sessionId = (payload.sessionId || "").substring(0, 64);
    const visitorId = (payload.visitorId || "").substring(0, 64);

    if (!sessionId || !visitorId) {
      return false;
    }

    const pool = await getDbConnection();
    const durationSeconds = Math.max(0, Math.min(86400, Math.floor(payload.durationSeconds || 0)));
    const incrementalSeconds = Math.max(0, Math.min(300, Math.floor(payload.incrementalSeconds || 0)));
    const maxScrollPercent = Math.max(0, Math.min(100, Math.floor(payload.maxScrollPercent || 0)));

    const pagePath = (payload.pagePath || "/").substring(0, 500);
    const pageTitle = payload.pageTitle ? payload.pageTitle.substring(0, 255) : null;
    const referrer = payload.referrer ? payload.referrer.substring(0, 500) : null;
    const landingPage = payload.landingPage ? payload.landingPage.substring(0, 500) : pagePath;
    const viewId = payload.viewId ? payload.viewId.substring(0, 64) : null;

    // 1. Upsert Visitor Session
    const sessionReq = pool.request();
    sessionReq.input("sessionId", sessionId);
    sessionReq.input("visitorId", visitorId);
    sessionReq.input("ipCountry", clientInfo.country);
    sessionReq.input("ipCity", clientInfo.city);
    sessionReq.input("deviceType", clientInfo.deviceType);
    sessionReq.input("browser", clientInfo.browser);
    sessionReq.input("os", clientInfo.os);
    sessionReq.input("referrer", referrer);
    sessionReq.input("landingPage", landingPage);
    sessionReq.input("incrementalSeconds", incrementalSeconds);
    sessionReq.input("durationSeconds", durationSeconds);

    await sessionReq.query(`
      IF NOT EXISTS (SELECT 1 FROM visitor_sessions WHERE session_id = @sessionId)
      BEGIN
        INSERT INTO visitor_sessions (
          session_id, visitor_id, ip_country, ip_city,
          device_type, browser, os, referrer, landing_page,
          started_at, ended_at, total_duration
        ) VALUES (
          @sessionId, @visitorId, @ipCountry, @ipCity,
          @deviceType, @browser, @os, @referrer, @landingPage,
          SYSUTCDATETIME(), SYSUTCDATETIME(), @durationSeconds
        );
      END
      ELSE
      BEGIN
        UPDATE visitor_sessions
        SET ended_at = SYSUTCDATETIME(),
            total_duration = total_duration + @incrementalSeconds
        WHERE session_id = @sessionId;
      END
    `);

    // 2. Upsert Page View if viewId is present
    if (viewId) {
      const pageReq = pool.request();
      pageReq.input("viewId", viewId);
      pageReq.input("sessionId", sessionId);
      pageReq.input("pagePath", pagePath);
      pageReq.input("pageTitle", pageTitle);
      pageReq.input("durationSeconds", durationSeconds);
      pageReq.input("maxScrollPercent", maxScrollPercent);
      pageReq.input("isLeave", payload.action === "page_leave" ? 1 : 0);

      await pageReq.query(`
        IF NOT EXISTS (SELECT 1 FROM page_views WHERE view_id = @viewId)
        BEGIN
          INSERT INTO page_views (
            view_id, session_id, page_path, page_title,
            duration_seconds, max_scroll_percent, entered_at, exited_at
          ) VALUES (
            @viewId, @sessionId, @pagePath, @pageTitle,
            @durationSeconds, @maxScrollPercent, SYSUTCDATETIME(),
            CASE WHEN @isLeave = 1 THEN SYSUTCDATETIME() ELSE NULL END
          );
        END
        ELSE
        BEGIN
          UPDATE page_views
          SET duration_seconds = CASE WHEN @durationSeconds > duration_seconds THEN @durationSeconds ELSE duration_seconds END,
              max_scroll_percent = CASE WHEN @maxScrollPercent > max_scroll_percent THEN @maxScrollPercent ELSE max_scroll_percent END,
              exited_at = CASE WHEN @isLeave = 1 THEN SYSUTCDATETIME() ELSE exited_at END
          WHERE view_id = @viewId;
        END
      `);

      // 3. Upsert Section Views if present
      if (Array.isArray(payload.sections) && payload.sections.length > 0) {
        for (const sec of payload.sections) {
          const sectionId = (sec.sectionId || "").substring(0, 100);
          const timeVisibleSeconds = Math.max(0, Math.min(86400, Math.floor(sec.timeVisibleSeconds || 0)));

          if (!sectionId) continue;

          const secReq = pool.request();
          secReq.input("viewId", viewId);
          secReq.input("sectionId", sectionId);
          secReq.input("timeVisibleSeconds", timeVisibleSeconds);

          await secReq.query(`
            IF NOT EXISTS (SELECT 1 FROM section_views WHERE view_id = @viewId AND section_id = @sectionId)
            BEGIN
              INSERT INTO section_views (view_id, section_id, time_visible_seconds, viewed_at)
              VALUES (@viewId, @sectionId, @timeVisibleSeconds, SYSUTCDATETIME());
            END
            ELSE
            BEGIN
              UPDATE section_views
              SET time_visible_seconds = CASE WHEN @timeVisibleSeconds > time_visible_seconds THEN @timeVisibleSeconds ELSE time_visible_seconds END
              WHERE view_id = @viewId AND section_id = @sectionId;
            END
          `);
        }
      }
    }

    return true;
  }
}
