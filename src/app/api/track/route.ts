export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { detectClientInfo } from "@/lib/tracking/detector";
import { TrackingService, TrackPayload } from "@/services/tracking/tracking.service";

// 1x1 transparent GIF binary buffer for CDN tracking beacons (Method 2)
const TRANSPARENT_GIF_BYTES = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

// In-Memory Rate Limiter against spam/DDoS attacks on telemetry endpoint
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, maxRequests = 180, windowMs = 60000): boolean {
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

function parseRawItem(raw: any): TrackPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const sessionId = raw.sessionId || raw.session_id;
  const visitorId = raw.visitorId || raw.visitor_id;
  if (!sessionId || !visitorId) return null;

  return {
    action: raw.action || "ping",
    sessionId,
    visitorId,
    viewId: raw.viewId || raw.view_id,
    pagePath: raw.pagePath || raw.page_path,
    pageTitle: raw.pageTitle || raw.page_title,
    referrer: raw.referrer,
    landingPage: raw.landingPage || raw.landing_page,
    durationSeconds: raw.durationSeconds ?? raw.duration_seconds,
    incrementalSeconds: raw.incrementalSeconds ?? raw.incremental_seconds,
    maxScrollPercent: raw.maxScrollPercent ?? raw.max_scroll_percent,
    scrollSpeed: raw.scrollSpeed ?? raw.scroll_speed,
    scrollPace: raw.scrollPace ?? raw.scroll_pace,
    totalScrolledPx: raw.totalScrolledPx ?? raw.total_scrolled_px,
    sections: raw.sections,
  };
}

/**
 * GET Handler - CDN 1x1 Transparent GIF Beacon (Method 2)
 * Allows CDNs (Cloudflare, AWS CloudFront) to log hits or respond with 0 origin DB load.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sid");
    const visitorId = searchParams.get("vid");

    if (sessionId && visitorId) {
      const clientInfo = detectClientInfo(request, searchParams.get("tz") || undefined);

      if (!clientInfo.isBot && !checkRateLimit(clientInfo.ip)) {
        const payload: TrackPayload = {
          action: (searchParams.get("act") as any) || "ping",
          sessionId,
          visitorId,
          viewId: searchParams.get("vi"),
          pagePath: searchParams.get("p") || "/",
          pageTitle: searchParams.get("t"),
          referrer: searchParams.get("ref"),
          landingPage: searchParams.get("lp") || undefined,
          durationSeconds: Number(searchParams.get("dur") || 0),
          incrementalSeconds: Number(searchParams.get("inc") || 0),
          maxScrollPercent: Number(searchParams.get("sc") || 0),
          scrollSpeed: Number(searchParams.get("spd") || 0),
          scrollPace: (searchParams.get("pace") as any) || "static",
          totalScrolledPx: Number(searchParams.get("px") || 0),
        };

        await TrackingService.processEvent(payload, clientInfo);
      }
    }

    return new NextResponse(TRANSPARENT_GIF_BYTES, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Content-Length": TRANSPARENT_GIF_BYTES.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new NextResponse(TRANSPARENT_GIF_BYTES, {
      status: 200,
      headers: { "Content-Type": "image/gif" },
    });
  }
}

/**
 * POST Handler - Telemetry Ingestion (supports single event or Edge CDN batch array)
 */
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

    if (!body) {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    // Extract client metadata (IP, OS, browser, device, geo, bot status)
    const clientInfo = detectClientInfo(request, body.timezone);

    // 1. Bot & Scanner Protection
    if (clientInfo.isBot) {
      return NextResponse.json({ ok: true, ignored: "bot" }, { status: 200 });
    }

    // 2. DDoS & Telemetry Flooding Protection
    if (checkRateLimit(clientInfo.ip)) {
      return NextResponse.json({ ok: true, ignored: "rate_limit" }, { status: 200 });
    }

    // 3. Process either an array of events (from Edge CDN worker) or single browser event
    const rawItems: any[] = Array.isArray(body) ? body : [body];
    let ingestedCount = 0;

    for (const raw of rawItems) {
      const payload = parseRawItem(raw);
      if (payload) {
        await TrackingService.processEvent(payload, clientInfo);
        ingestedCount++;
      }
    }

    if (ingestedCount === 0) {
      return NextResponse.json({ ok: false, message: "Missing sessionId or visitorId" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, count: ingestedCount }, { status: 200 });
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
