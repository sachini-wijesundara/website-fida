export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { detectClientInfo } from "@/lib/tracking/detector";
import { TrackingService, TrackPayload } from "@/services/tracking/tracking.service";

// In-Memory Rate Limiter against spam/DDoS attacks on telemetry endpoint
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxRequests = 120, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return true; // Exceeded limit
  }

  // Periodic pruning of expired entries
  if (ipRateMap.size > 5000) {
    for (const [key, val] of ipRateMap.entries()) {
      if (now > val.resetAt) {
        ipRateMap.delete(key);
      }
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    let body: any = null;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = null;
        }
      }
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    // Extract client metadata (IP, OS, browser, device, geo, bot status)
    const clientInfo = detectClientInfo(request, body.timezone);

    // 1. Bot & Scanner Protection
    if (clientInfo.isBot) {
      return NextResponse.json({ ok: true, ignored: "bot" }, { status: 200 });
    }

    // 2. DDoS & Telemetry Flooding Protection (max 120 requests/minute per IP)
    if (checkRateLimit(clientInfo.ip)) {
      return NextResponse.json({ ok: true, ignored: "rate_limit" }, { status: 200 });
    }

    const payload: TrackPayload = {
      action: body.action || "ping",
      sessionId: body.sessionId || body.session_id,
      visitorId: body.visitorId || body.visitor_id,
      viewId: body.viewId || body.view_id,
      pagePath: body.pagePath || body.page_path,
      pageTitle: body.pageTitle || body.page_title,
      referrer: body.referrer,
      landingPage: body.landingPage || body.landing_page,
      durationSeconds: body.durationSeconds ?? body.duration_seconds,
      incrementalSeconds: body.incrementalSeconds ?? body.incremental_seconds,
      maxScrollPercent: body.maxScrollPercent ?? body.max_scroll_percent,
      scrollSpeed: body.scrollSpeed ?? body.scroll_speed,
      scrollPace: body.scrollPace ?? body.scroll_pace,
      totalScrolledPx: body.totalScrolledPx ?? body.total_scrolled_px,
      sections: body.sections,
    };

    if (!payload.sessionId || !payload.visitorId) {
      return NextResponse.json({ ok: false, message: "Missing sessionId or visitorId" }, { status: 400 });
    }

    await TrackingService.processEvent(payload, clientInfo);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error("Telemetry ingestion error:", error);
    return NextResponse.json({ ok: false, error: "Ingestion failed" }, { status: 200 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
