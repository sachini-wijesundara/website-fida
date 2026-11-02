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
  scrollSpeed?: number;
  scrollPace?: "reading" | "skimming" | "rapid" | "static";
  totalScrolledPx?: number;
  sections?: Array<{
    sectionId: string;
    timeVisibleSeconds: number;
  }>;
}

export interface SessionPageItem {
  view_id: string;
  page_path: string;
  page_title?: string | null;
  duration_seconds: number;
  max_scroll_percent: number;
  scroll_speed_px?: number;
  scroll_pace?: "reading" | "skimming" | "rapid" | "static";
  total_scrolled_px?: number;
  entered_at: string;
}

export interface BufferedSession {
  sessionId: string;
  visitorId: string;
  ipCountry: string | null;
  ipCity: string | null;
  deviceType: string;
  browser: string;
  os: string;
  referrer: string | null;
  landingPage: string;
  lastPage: string;
  pageCount: number;
  totalDuration: number;
  maxScroll: number;
  pages: SessionPageItem[];
  startedAt: string;
  lastActive: number;
  isDirty: boolean;
  sections: Record<string, number>;
}

// Global In-Memory Buffer (persists across Next.js dev reloads)
type TrackingGlobal = typeof globalThis & {
  __fidaSessionBuffer?: Map<string, BufferedSession>;
  __fidaFlushTimer?: NodeJS.Timeout;
};

const g = globalThis as TrackingGlobal;
if (!g.__fidaSessionBuffer) {
  g.__fidaSessionBuffer = new Map<string, BufferedSession>();
}
const sessionBuffer = g.__fidaSessionBuffer;

let isFlushing = false;

async function flushSessionToDb(session: BufferedSession): Promise<void> {
  const pool = await getDbConnection();
  const req = pool.request();
  req.input("sessionId", session.sessionId);
  req.input("visitorId", session.visitorId);
  req.input("ipCountry", session.ipCountry);
  req.input("ipCity", session.ipCity);
  req.input("deviceType", session.deviceType);
  req.input("browser", session.browser);
  req.input("os", session.os);
  req.input("referrer", session.referrer);
  req.input("landingPage", session.landingPage);
  req.input("lastPage", session.lastPage);
  req.input("pageCount", session.pageCount);
  req.input("totalDuration", session.totalDuration);
  req.input("maxScroll", session.maxScroll);
  req.input("pagesJson", JSON.stringify(session.pages));

  await req.query(`
    IF NOT EXISTS (SELECT 1 FROM visitor_sessions WHERE session_id = @sessionId)
    BEGIN
      INSERT INTO visitor_sessions (
        session_id, visitor_id, ip_country, ip_city,
        device_type, browser, os, referrer, landing_page,
        last_page, page_count, total_duration, max_scroll,
        started_at, ended_at, pages_json
      ) VALUES (
        @sessionId, @visitorId, @ipCountry, @ipCity,
        @deviceType, @browser, @os, @referrer, @landingPage,
        @lastPage, @pageCount, @totalDuration, @maxScroll,
        SYSUTCDATETIME(), SYSUTCDATETIME(), @pagesJson
      );
    END
    ELSE
    BEGIN
      UPDATE visitor_sessions
      SET ended_at = SYSUTCDATETIME(),
          last_page = @lastPage,
          page_count = @pageCount,
          total_duration = @totalDuration,
          max_scroll = @maxScroll,
          pages_json = @pagesJson
      WHERE session_id = @sessionId;
    END
  `);

  session.isDirty = false;
}

export async function flushAllDirtySessions(): Promise<number> {
  if (isFlushing) return 0;
  isFlushing = true;
  let flushedCount = 0;

  try {
    const dirtyList: BufferedSession[] = [];
    const now = Date.now();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes inactivity

    for (const [id, session] of sessionBuffer.entries()) {
      if (session.isDirty) {
        dirtyList.push(session);
      } else if (now - session.lastActive > staleThreshold) {
        sessionBuffer.delete(id);
      }
    }

    for (const session of dirtyList) {
      try {
        await flushSessionToDb(session);
        flushedCount++;
      } catch (err) {
        console.error(`[Tracking Buffer] Error flushing session ${session.sessionId}:`, err);
      }
    }
  } finally {
    isFlushing = false;
  }

  return flushedCount;
}

// Background worker: Flush dirty sessions to DB every 10 seconds
if (!g.__fidaFlushTimer) {
  g.__fidaFlushTimer = setInterval(() => {
    flushAllDirtySessions().catch((err) => {
      console.error("[Tracking Buffer] Scheduled flush failed:", err);
    });
  }, 10000);
}

export class TrackingService {
  /**
   * Ingest tracking telemetry into in-memory buffer and periodically batch-write to single visitor_sessions table
   */
  public static async processEvent(payload: TrackPayload, clientInfo: ClientInfo): Promise<boolean> {
    if (clientInfo.isBot) {
      return false;
    }

    const sessionId = (payload.sessionId || "").substring(0, 64);
    const visitorId = (payload.visitorId || "").substring(0, 64);

    if (!sessionId || !visitorId) {
      return false;
    }

    const durationSeconds = Math.max(0, Math.min(86400, Math.floor(payload.durationSeconds || 0)));
    const incrementalSeconds = Math.max(0, Math.min(300, Math.floor(payload.incrementalSeconds || 0)));
    const maxScrollPercent = Math.max(0, Math.min(100, Math.floor(payload.maxScrollPercent || 0)));
    const scrollSpeed = Math.max(0, Math.min(25000, Math.floor(payload.scrollSpeed || 0)));
    const scrollPace = payload.scrollPace || "static";
    const totalScrolledPx = Math.max(0, Math.floor(payload.totalScrolledPx || 0));

    const pagePath = (payload.pagePath || "/").substring(0, 500);
    const pageTitle = payload.pageTitle ? payload.pageTitle.substring(0, 255) : null;
    const referrer = payload.referrer ? payload.referrer.substring(0, 500) : null;
    const landingPage = payload.landingPage ? payload.landingPage.substring(0, 500) : pagePath;
    const viewId = payload.viewId ? payload.viewId.substring(0, 64) : `pv_${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    let session = sessionBuffer.get(sessionId);

    if (!session) {
      // Initialize new session in memory buffer
      session = {
        sessionId,
        visitorId,
        ipCountry: clientInfo.country,
        ipCity: clientInfo.city,
        deviceType: clientInfo.deviceType,
        browser: clientInfo.browser,
        os: clientInfo.os,
        referrer,
        landingPage,
        lastPage: pagePath,
        pageCount: 1,
        totalDuration: durationSeconds,
        maxScroll: maxScrollPercent,
        pages: [
          {
            view_id: viewId,
            page_path: pagePath,
            page_title: pageTitle,
            duration_seconds: durationSeconds,
            max_scroll_percent: maxScrollPercent,
            scroll_speed_px: scrollSpeed,
            scroll_pace: scrollPace,
            total_scrolled_px: totalScrolledPx,
            entered_at: nowIso,
          },
        ],
        startedAt: nowIso,
        lastActive: Date.now(),
        isDirty: true,
        sections: {},
      };
      sessionBuffer.set(sessionId, session);
    } else {
      // Update existing in-memory session
      session.lastActive = Date.now();
      session.lastPage = pagePath;
      session.maxScroll = Math.max(session.maxScroll, maxScrollPercent);

      if (incrementalSeconds > 0) {
        session.totalDuration += incrementalSeconds;
      } else if (durationSeconds > session.totalDuration) {
        session.totalDuration = durationSeconds;
      }

      // Check if page already exists in pages array (match by view_id first, or last page if path matches)
      let existingPage = session.pages.find((p) => p.view_id === viewId);
      if (!existingPage && session.pages.length > 0 && session.pages[session.pages.length - 1].page_path === pagePath) {
        existingPage = session.pages[session.pages.length - 1];
      }

      if (existingPage) {
        if (incrementalSeconds > 0) {
          existingPage.duration_seconds += incrementalSeconds;
        } else if (durationSeconds > existingPage.duration_seconds) {
          existingPage.duration_seconds = durationSeconds;
        }
        existingPage.max_scroll_percent = Math.max(existingPage.max_scroll_percent, maxScrollPercent);
        if (scrollSpeed > 0) {
          existingPage.scroll_speed_px = scrollSpeed;
        }
        if (scrollPace && scrollPace !== "static") {
          existingPage.scroll_pace = scrollPace;
        }
        if (totalScrolledPx > 0) {
          existingPage.total_scrolled_px = Math.max(existingPage.total_scrolled_px || 0, totalScrolledPx);
        }
        if (pageTitle && !existingPage.page_title) {
          existingPage.page_title = pageTitle;
        }
      } else {
        // New page visited in existing session!
        if (session.pages.length < 35) {
          session.pages.push({
            view_id: viewId,
            page_path: pagePath,
            page_title: pageTitle,
            duration_seconds: durationSeconds,
            max_scroll_percent: maxScrollPercent,
            scroll_speed_px: scrollSpeed,
            scroll_pace: scrollPace,
            total_scrolled_px: totalScrolledPx,
            entered_at: nowIso,
          });
        }
        session.pageCount++;
      }

      // Aggregate section view times in memory
      if (Array.isArray(payload.sections)) {
        for (const sec of payload.sections) {
          if (sec.sectionId) {
            const current = session.sections[sec.sectionId] || 0;
            session.sections[sec.sectionId] = Math.max(current, sec.timeVisibleSeconds || 0);
          }
        }
      }

      session.isDirty = true;
    }

    // If user leaves the page or buffer gets large (>25 dirty items), flush immediately
    if (payload.action === "page_leave" || sessionBuffer.size > 25) {
      flushSessionToDb(session).catch((err) => {
        console.error(`[Tracking] Immediate flush failed for session ${sessionId}:`, err);
      });
    }

    return true;
  }
}
