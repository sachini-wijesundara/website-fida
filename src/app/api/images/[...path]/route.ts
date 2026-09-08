// No `export const dynamic` — let Next.js use its default (static where possible)
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

// ── In-memory image cache ──────────────────────────────────────────────────
// Avoids repeated DB hits for the same image within a server instance.
const IMAGE_CACHE = new Map<string, { data: string; ts: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_MAX = 200;

function getCached(key: string): string | null {
  const entry = IMAGE_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    IMAGE_CACHE.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, value: string) {
  if (IMAGE_CACHE.size >= CACHE_MAX) {
    // Evict oldest entry
    const firstKey = IMAGE_CACHE.keys().next().value;
    if (firstKey !== undefined) IMAGE_CACHE.delete(firstKey);
  }
  IMAGE_CACHE.set(key, { data: value, ts: Date.now() });
}
// ──────────────────────────────────────────────────────────────────────────

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    let relativePath = params.path.join("/");
    relativePath = decodeURIComponent(relativePath);

    // ── Browser / CDN cache headers ──────────────────────────────────────
    const CACHE_HEADERS = {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    };

    // ── Check in-memory cache first ──────────────────────────────────────
    const cached = getCached(relativePath);
    if (cached) {
      // Check ETag for 304 Not Modified
      const etag = `"${relativePath.replace(/[^a-z0-9]/gi, "_")}"`;
      if (request.headers.get("if-none-match") === etag) {
        return new NextResponse(null, { status: 304, headers: { ...CACHE_HEADERS, ETag: etag } });
      }

      if (!cached.startsWith("data:")) {
        return NextResponse.redirect(new URL(cached, request.url));
      }
      const match = cached.match(/^data:([^;,]+);base64,([\s\S]+)$/);
      if (!match) return NextResponse.json({ message: "Invalid stored image" }, { status: 500 });

      return new NextResponse(Buffer.from(match[2], "base64"), {
        headers: { "Content-Type": match[1], ...CACHE_HEADERS, ETag: etag },
      });
    }

    // ── Fetch from DB ─────────────────────────────────────────────────────
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("Title", relativePath)
      .query(`SELECT image_data FROM dbo.Images WHERE title = @Title`);

    const imageUrl = result.recordset[0]?.image_data as string | undefined;

    if (!imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    // Store in cache for next request
    setCached(relativePath, imageUrl);

    const etag = `"${relativePath.replace(/[^a-z0-9]/gi, "_")}"`;

    if (!imageUrl.startsWith("data:")) {
      return NextResponse.redirect(new URL(imageUrl, request.url));
    }

    const match = imageUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/);
    if (!match) {
      return NextResponse.json({ message: "Invalid stored image" }, { status: 500 });
    }

    return new NextResponse(Buffer.from(match[2], "base64"), {
      headers: {
        "Content-Type": match[1],
        ...CACHE_HEADERS,
        ETag: etag,
      },
    });
  } catch (error: any) {
    console.error("Image API error:", error);
    return NextResponse.json({ message: "Failed to load image from DB" }, { status: 500 });
  }
}
