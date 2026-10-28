export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    let days = 7;
    if (range === "today") days = 1;
    else if (range === "30d") days = 30;
    else if (range === "12m" || range === "all") days = 365;

    const pool = await getDbConnection();

    // 1. Overview KPIs
    const kpiRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT
          (SELECT COUNT(*) FROM visitor_sessions WHERE started_at >= @startDate) AS totalSessions,
          (SELECT COUNT(DISTINCT visitor_id) FROM visitor_sessions WHERE started_at >= @startDate) AS uniqueVisitors,
          (SELECT COUNT(*) FROM page_views WHERE entered_at >= @startDate) AS totalPageViews,
          (SELECT ISNULL(AVG(total_duration), 0) FROM visitor_sessions WHERE started_at >= @startDate) AS avgSessionDuration,
          (SELECT ISNULL(AVG(max_scroll_percent), 0) FROM page_views WHERE entered_at >= @startDate) AS avgScrollPercent;
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

    // 3. Top Pages
    const pagesRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT TOP 10
          page_path,
          COUNT(*) AS views,
          COUNT(DISTINCT session_id) AS unique_sessions,
          ISNULL(AVG(duration_seconds), 0) AS avg_duration,
          ISNULL(AVG(max_scroll_percent), 0) AS avg_scroll
        FROM page_views
        WHERE entered_at >= @startDate
        GROUP BY page_path
        ORDER BY views DESC;
      `);

    // 4. Scroll Funnel Distribution
    const scrollRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT
          COUNT(*) AS total_views,
          SUM(CASE WHEN max_scroll_percent >= 25 THEN 1 ELSE 0 END) AS scroll_25,
          SUM(CASE WHEN max_scroll_percent >= 50 THEN 1 ELSE 0 END) AS scroll_50,
          SUM(CASE WHEN max_scroll_percent >= 75 THEN 1 ELSE 0 END) AS scroll_75,
          SUM(CASE WHEN max_scroll_percent >= 90 THEN 1 ELSE 0 END) AS scroll_90
        FROM page_views
        WHERE entered_at >= @startDate;
      `);

    const scrollStats = scrollRes.recordset[0] || {
      total_views: 0,
      scroll_25: 0,
      scroll_50: 0,
      scroll_75: 0,
      scroll_90: 0,
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

    // 8. Recent Sessions & Visitor Page Trails Log
    const recentRes = await pool.request().query(`
      SELECT TOP 20
        s.session_id,
        s.visitor_id,
        s.ip_country,
        s.ip_city,
        s.device_type,
        s.browser,
        s.os,
        s.landing_page,
        s.total_duration,
        s.started_at,
        COUNT(p.view_id) AS page_count,
        (
          SELECT 
            p2.view_id,
            p2.page_path,
            p2.page_title,
            p2.duration_seconds,
            p2.max_scroll_percent,
            p2.entered_at
          FROM page_views p2
          WHERE p2.session_id = s.session_id
          ORDER BY p2.entered_at ASC
          FOR JSON PATH
        ) AS pages_json
      FROM visitor_sessions s
      LEFT JOIN page_views p ON s.session_id = p.session_id
      GROUP BY 
        s.session_id, s.visitor_id, s.ip_country, s.ip_city,
        s.device_type, s.browser, s.os, s.landing_page,
        s.total_duration, s.started_at
      ORDER BY s.started_at DESC;
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
      const pages = JSON.parse(r.pages_json || "[]");
      const totalDuration = r.total_duration || 0;
      const maxScroll = Math.max(0, ...pages.map((p: any) => p.max_scroll_percent || 0));
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

    // 9. Top Sections
    const sectionRes = await pool
      .request()
      .input("days", days)
      .query(`
        DECLARE @startDate DATETIME2 = DATEADD(day, -@days, SYSUTCDATETIME());

        SELECT TOP 8
          section_id,
          COUNT(*) AS total_views,
          ISNULL(AVG(time_visible_seconds), 0) AS avg_time
        FROM section_views
        WHERE viewed_at >= @startDate
        GROUP BY section_id
        ORDER BY total_views DESC;
      `);

    return NextResponse.json({
      kpi,
      timeline: timelineRes.recordset,
      topPages: pagesRes.recordset,
      scrollFunnel: scrollStats,
      inquiryFunnel,
      leadStats,
      devices: deviceRes.recordset,
      browsers: browserRes.recordset,
      operatingSystems: osRes.recordset,
      countries: countryRes.recordset,
      recentSessions: formattedSessions,
      topSections: sectionRes.recordset,
    });
  } catch (error: any) {
    console.error("Admin Analytics API error:", error);
    return NextResponse.json({ message: "Failed to fetch analytics", error: error?.message, stack: error?.stack }, { status: 500 });
  }
}
