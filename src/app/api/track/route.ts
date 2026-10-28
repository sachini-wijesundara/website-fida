export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { detectClientInfo } from "@/lib/tracking/detector";
import { TrackingService, TrackPayload } from "@/services/tracking/tracking.service";

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

    // If bot, acknowledge with 200 without writing to DB
    if (clientInfo.isBot) {
      return NextResponse.json({ ok: true, ignored: "bot" }, { status: 200 });
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
      sections: body.sections,
    };

    if (!payload.sessionId || !payload.visitorId) {
      return NextResponse.json({ ok: false, message: "Missing sessionId or visitorId" }, { status: 400 });
    }

    await TrackingService.processEvent(payload, clientInfo);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error("Telemetry ingestion error:", error);
    // Don't crash client tracking calls
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
