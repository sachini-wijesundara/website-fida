export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { flushAllDirtySessions } from "@/services/tracking/tracking.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    let days = 7;
    if (range === "today") days = 1;
    else if (range === "30d") days = 30;
    else if (range === "12m" || range === "all") days = 365;

    // Flush any pending in-memory buffer so the dashboard always has real-time data
    try {
      await flushAllDirtySessions();
    } catch {}

    const pool = await getDbConnection();

    // 1. Overview KPIs (Calculated instantly from single visitor_sessions table)
    const kpiRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT
          (SELECT COUNT(*) FROM visitor_sessions WHERE started_at >= @startDate) AS totalSessions,
          (SELECT COUNT(DISTINCT visitor_id) FROM visitor_sessions WHERE started_at >= @startDate) AS uniqueVisitors,
          (SELECT ISNULL(SUM(page_count), 0) FROM visitor_sessions WHERE started_at >= @startDate) AS totalPageViews,
          (SELECT ISNULL(AVG(total_duration), 0) FROM visitor_sessions WHERE started_at >= @startDate) AS avgSessionDuration,
          (SELECT ISNULL(AVG(max_scroll), 0) FROM visitor_sessions WHERE started_at >= @startDate) AS avgScrollPercent;
      `);

    const kpi = kpiRes.recordset[0] || {
      totalSessions: 0,
      uniqueVisitors: 0,
      totalPageViews: 0,
      avgSessionDuration: 0,
      avgScrollPercent: 0,
    };

    // 2. Daily Timeline
    const timelineRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT 
          CONVERT(VARCHAR(10), started_at, 120) AS [date],
          COUNT(*) AS sessions,
          COUNT(DISTINCT visitor_id) AS visitors
        FROM visitor_sessions
        WHERE started_at >= @startDate
        GROUP BY CONVERT(VARCHAR(10), started_at, 120)
        ORDER BY [date] ASC;
      `);

    // 3. Top Pages (Extracted from pages_json via OPENJSON - zero JOINs)
    let topPages: any[] = [];
    try {
      const pagesRes = await pool
        .request()
        .input("days", days)
        .query(`
          DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

          SELECT TOP 10
            j.page_path,
            COUNT(*) AS views,
            COUNT(DISTINCT s.session_id) AS unique_sessions,
            ISNULL(AVG(j.duration_seconds), 0) AS avg_duration,
            ISNULL(AVG(j.max_scroll_percent), 0) AS avg_scroll,
            ISNULL(AVG(NULLIF(j.scroll_speed_px, 0)), 0) AS avg_scroll_speed,
            ISNULL(AVG(NULLIF(j.total_scrolled_px, 0)), 0) AS avg_scrolled_px
          FROM visitor_sessions s
          CROSS APPLY OPENJSON(s.pages_json)
          WITH (
            page_path NVARCHAR(500) '$.page_path',
            duration_seconds INT '$.duration_seconds',
            max_scroll_percent INT '$.max_scroll_percent',
            scroll_speed_px INT '$.scroll_speed_px',
            total_scrolled_px INT '$.total_scrolled_px'
          ) j
          WHERE s.started_at >= @startDate AND j.page_path IS NOT NULL AND j.page_path <> ''
          GROUP BY j.page_path
          ORDER BY views DESC;
        `);
      topPages = pagesRes.recordset;
    } catch {
      topPages = [];
    }

    if (!topPages || topPages.length === 0) {
      try {
        const fallbackRes = await pool
          .request()
          .input("days", days)
          .query(`
            DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

            SELECT TOP 10
              ISNULL(landing_page, '/') AS page_path,
              COUNT(*) AS views,
              COUNT(DISTINCT session_id) AS unique_sessions,
              ISNULL(AVG(total_duration), 0) AS avg_duration,
              ISNULL(AVG(max_scroll), 0) AS avg_scroll,
              0 AS avg_scroll_speed,
              0 AS avg_scrolled_px
            FROM visitor_sessions
            WHERE started_at >= @startDate AND landing_page IS NOT NULL
            GROUP BY landing_page
            ORDER BY views DESC;
          `);
        topPages = fallbackRes.recordset;
      } catch {}
    }

    // 4. Scroll Funnel Distribution
    let siteAvgScrollSpeed = 0;
    try {
      const speedRes = await pool
        .request()
        .input("days", days)
        .query(`
          DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

          SELECT
            ISNULL(AVG(j.scroll_speed_px), 0) AS avg_speed
          FROM visitor_sessions s
          CROSS APPLY OPENJSON(s.pages_json)
          WITH (
            scroll_speed_px INT '$.scroll_speed_px'
          ) j
          WHERE s.started_at >= @startDate AND j.scroll_speed_px > 0;
        `);
      siteAvgScrollSpeed = speedRes.recordset[0]?.avg_speed || 0;
    } catch {}

    const scrollRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT
          COUNT(*) AS total_views,
          SUM(CASE WHEN max_scroll >= 25 THEN 1 ELSE 0 END) AS scroll_25,
          SUM(CASE WHEN max_scroll >= 50 THEN 1 ELSE 0 END) AS scroll_50,
          SUM(CASE WHEN max_scroll >= 75 THEN 1 ELSE 0 END) AS scroll_75,
          SUM(CASE WHEN max_scroll >= 90 THEN 1 ELSE 0 END) AS scroll_90
        FROM visitor_sessions
        WHERE started_at >= @startDate;
      `);

    const scrollStats = {
      ...(scrollRes.recordset[0] || {
        total_views: 0,
        scroll_25: 0,
        scroll_50: 0,
        scroll_75: 0,
        scroll_90: 0,
      }),
      avg_scroll_speed: Math.round(siteAvgScrollSpeed),
    };

    // 5. Device Breakdown
    const deviceRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT 
          ISNULL(device_type, 'desktop') AS device,
          COUNT(*) AS [count]
        FROM visitor_sessions
        WHERE started_at >= @startDate
        GROUP BY device_type;
      `);

    // 6. Top Browsers & OS
    const browserRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT TOP 5
          ISNULL(browser, 'Other') AS name,
          COUNT(*) AS [count]
        FROM visitor_sessions
        WHERE started_at >= @startDate
        GROUP BY browser
        ORDER BY [count] DESC;
      `);

    const osRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT TOP 5
          ISNULL(os, 'Other') AS name,
          COUNT(*) AS [count]
        FROM visitor_sessions
        WHERE started_at >= @startDate
        GROUP BY os
        ORDER BY [count] DESC;
      `);

    // 7. Top Countries
    const countryRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT TOP 6
          ISNULL(ip_country, 'Other') AS country,
          COUNT(*) AS [count]
        FROM visitor_sessions
        WHERE started_at >= @startDate
        GROUP BY ip_country
        ORDER BY [count] DESC;
      `);

    // 8. Recent Sessions & Visitor Page Trails Log (Instant single-table scan)
    const recentRes = await pool.request().query(`
      SELECT TOP 25
        session_id,
        visitor_id,
        ip_country,
        ip_city,
        device_type,
        browser,
        os,
        landing_page,
        last_page,
        page_count,
        total_duration,
        max_scroll,
        started_at,
        pages_json
      FROM visitor_sessions
      ORDER BY started_at DESC;
    `);

    const HIGH_VALUE_PAGES: Record<string, number> = {
      "/contact": 25,
      "/company-profile": 15,
      "/services": 15,
      "/products": 15,
      "/solutions": 10,
      "/careers": 10,
    };

    const formattedSessions = recentRes.recordset.map((r: any) => {
      let pages: any[] = [];
      try {
        pages = JSON.parse(r.pages_json || "[]");
      } catch {
        pages = [];
      }

      if (pages.length === 0 && r.landing_page) {
        pages = [
          {
            page_path: r.landing_page,
            page_title: "Landing",
            duration_seconds: r.total_duration || 0,
            max_scroll_percent: r.max_scroll || 0,
            entered_at: r.started_at,
          },
        ];
      }

      const totalDuration = r.total_duration || 0;
      const maxScroll = Math.max(r.max_scroll || 0, ...pages.map((p: any) => p.max_scroll_percent || 0));
      const visitedPaths: string[] = pages.map(
        (p: any) => (p.page_path || "").split("?")[0].replace(/\/$/, "") || "/"
      );

      // 1. Scroll Score (Max 25 pts)
      let scrollScore = 0;
      if (maxScroll >= 95) scrollScore = 25;
      else if (maxScroll >= 75) scrollScore = 20;
      else if (maxScroll >= 50) scrollScore = 10;

      // 2. Dwell Time Score (Max 35 pts)
      let dwellScore = 0;
      if (totalDuration >= 180) dwellScore = 35;
      else if (totalDuration >= 90) dwellScore = 25;
      else if (totalDuration >= 45) dwellScore = 15;
      else if (totalDuration >= 20) dwellScore = 8;

      // 3. High-Intent Page Visited (Max 25 pts)
      let intentScore = 0;
      for (const [path, pts] of Object.entries(HIGH_VALUE_PAGES)) {
        if (visitedPaths.some((p) => p === path || p.startsWith(path))) {
          intentScore = Math.max(intentScore, pts);
        }
      }

      // 4. Browsing Breadth (Max 15 pts)
      const uniqueCount = new Set(visitedPaths).size;
      let breadthScore = 0;
      if (uniqueCount >= 4) breadthScore = 15;
      else if (uniqueCount >= 2) breadthScore = 10;

      const totalScore = Math.min(100, scrollScore + dwellScore + intentScore + breadthScore);

      let category: "hot" | "warm" | "cold" = "cold";
      let label = "Casual Visitor";
      let badge = "❄️ Cold";

      if (totalScore >= 70) {
        category = "hot";
        label = "High-Intent Hot Lead";
        badge = "🔥 Hot Lead";
      } else if (totalScore >= 40) {
        category = "warm";
        label = "Engaged Warm Prospect";
        badge = "⚡ Warm Lead";
      }

      return {
        session_id: r.session_id,
        visitor_id: r.visitor_id,
        ip_country: r.ip_country,
        ip_city: r.ip_city,
        device_type: r.device_type,
        browser: r.browser,
        os: r.os,
        landing_page: r.landing_page,
        total_duration: r.total_duration,
        started_at: r.started_at,
        page_count: r.page_count || pages.length,
        pages,
        lead: {
          score: totalScore,
          category,
          label,
          badge,
          maxScroll,
          breakdown: {
            scrollScore,
            dwellScore,
            intentScore,
            breadthScore,
          },
        },
      };
    });

    // Calculate Inquiry Conversion Funnel across all sessions
    const offeringPaths = ["/services", "/products", "/solutions"];
    const conversionPaths = ["/contact", "/careers", "/company-profile"];

    let funnelStep1 = 0; // Visited Home (/)
    let funnelStep2 = 0; // Visited Offerings
    let funnelStep3 = 0; // Reached Conversion (Contact)

    formattedSessions.forEach((s) => {
      const paths: string[] = s.pages.map(
        (p: any) => (p.page_path || "").split("?")[0].replace(/\/$/, "") || "/"
      );
      const hasHome = paths.includes("/");
      const hasOffering = paths.some((p: string) => offeringPaths.some((o) => p === o || p.startsWith(o)));
      const hasConversion = paths.some((p: string) => conversionPaths.some((c) => p === c || p.startsWith(c)));

      if (hasHome) {
        funnelStep1++;
        if (hasOffering) {
          funnelStep2++;
          if (hasConversion) {
            funnelStep3++;
          }
        }
      }
    });

    const inquiryFunnel = {
      step1: { label: "Homepage Landing (/)", count: funnelStep1, pct: 100 },
      step2: {
        label: "Offerings Discovery (/services, /solutions)",
        count: funnelStep2,
        pct: funnelStep1 > 0 ? Math.round((funnelStep2 / funnelStep1) * 100) : 0,
        dropOffPct: funnelStep1 > 0 ? Math.round((1 - funnelStep2 / funnelStep1) * 100) : 0,
      },
      step3: {
        label: "High-Intent Action (/contact, /careers)",
        count: funnelStep3,
        pct: funnelStep1 > 0 ? Math.round((funnelStep3 / funnelStep1) * 100) : 0,
        dropOffPct: funnelStep2 > 0 ? Math.round((1 - funnelStep3 / funnelStep2) * 100) : 0,
      },
    };

    const leadStats = {
      hotCount: formattedSessions.filter((s) => s.lead.category === "hot").length,
      warmCount: formattedSessions.filter((s) => s.lead.category === "warm").length,
      coldCount: formattedSessions.filter((s) => s.lead.category === "cold").length,
    };

    return NextResponse.json({
      kpi,
      timeline: timelineRes.recordset,
      topPages,
      scrollFunnel: scrollStats,
      inquiryFunnel,
      leadStats,
      devices: deviceRes.recordset,
      browsers: browserRes.recordset,
      operatingSystems: osRes.recordset,
      countries: countryRes.recordset,
      recentSessions: formattedSessions,
      topSections: [],
    });
  } catch (error: any) {
    console.error("Admin Analytics API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics", error: error?.message, stack: error?.stack },
      { status: 500 }
    );
  }
}
