// No `export const dynamic` — let Next.js use its default (static where possible)
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import fs from "fs";
import path from "path";

// ── In-memory & disk image cache ──────────────────────────────────────────
const IMAGE_CACHE = new Map<string, { buffer: Buffer; mimeType: string; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_MAX = 300;

const DISK_CACHE_DIR = path.join(process.cwd(), ".cache", "fida-images");

function ensureDiskCacheDir() {
  try {
    if (!fs.existsSync(DISK_CACHE_DIR)) {
      fs.mkdirSync(DISK_CACHE_DIR, { recursive: true });
    }
  } catch {}
}

function getDiskCachePath(key: string): { filePath: string; metaPath: string } {
  const safeKey = Buffer.from(key).toString("hex");
  return {
    filePath: path.join(DISK_CACHE_DIR, `${safeKey}.bin`),
    metaPath: path.join(DISK_CACHE_DIR, `${safeKey}.meta`),
  };
}

function getCached(key: string): { buffer: Buffer; mimeType: string } | null {
  // 1. Memory check
  const entry = IMAGE_CACHE.get(key);
  if (entry) {
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      IMAGE_CACHE.delete(key);
    } else {
      return { buffer: entry.buffer, mimeType: entry.mimeType };
    }
  }

  // 2. Disk check
  try {
    const { filePath, metaPath } = getDiskCachePath(key);
    if (fs.existsSync(filePath) && fs.existsSync(metaPath)) {
      const buffer = fs.readFileSync(filePath);
      const mimeType = fs.readFileSync(metaPath, "utf8").trim() || "image/jpeg";
      setCached(key, buffer, mimeType, false);
      return { buffer, mimeType };
    }
  } catch {}

  return null;
}

function setCached(key: string, buffer: Buffer, mimeType: string, writeToDisk = true) {
  if (IMAGE_CACHE.size >= CACHE_MAX) {
    const firstKey = IMAGE_CACHE.keys().next().value;
    if (firstKey !== undefined) IMAGE_CACHE.delete(firstKey);
  }
  IMAGE_CACHE.set(key, { buffer, mimeType, ts: Date.now() });

  if (writeToDisk) {
    try {
      ensureDiskCacheDir();
      const { filePath, metaPath } = getDiskCachePath(key);
      fs.writeFileSync(filePath, buffer);
      fs.writeFileSync(metaPath, mimeType, "utf8");
    } catch {}
  }
}
// ──────────────────────────────────────────────────────────────────────────
function parseDataUri(dataUri: string): { mimeType: string; buffer: Buffer } | null {
  const commaIdx = dataUri.indexOf(",");
  if (commaIdx === -1) return null;
  const meta = dataUri.substring(0, commaIdx);
  const match = meta.match(/^data:([^;,]+);base64$/i);
  const mimeType = match ? match[1] : "image/jpeg";
  const base64Data = dataUri.substring(commaIdx + 1);
  return { mimeType, buffer: Buffer.from(base64Data, "base64") };
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    let relativePath = params.path.join("/");
    relativePath = decodeURIComponent(relativePath);

    const CACHE_HEADERS = {
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    const etag = `"${relativePath.replace(/[^a-z0-9]/gi, "_")}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers: { ...CACHE_HEADERS, ETag: etag } });
    }

    // ── Check cache first (memory & disk) ─────────────────────────────────
    const cached = getCached(relativePath);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: { "Content-Type": cached.mimeType, ...CACHE_HEADERS, ETag: etag },
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

    if (!imageUrl.startsWith("data:")) {
      return NextResponse.redirect(new URL(imageUrl, request.url));
    }

    const parsed = parseDataUri(imageUrl);
    if (!parsed) {
      return NextResponse.json({ message: "Invalid stored image" }, { status: 500 });
    }

    // Store in memory & disk cache
    setCached(relativePath, parsed.buffer, parsed.mimeType, true);

    return new NextResponse(new Uint8Array(parsed.buffer), {
      headers: {
        "Content-Type": parsed.mimeType,
        ...CACHE_HEADERS,
        ETag: etag,
      },
    });
  } catch (error: any) {
    console.error("Image API error:", error);
    return NextResponse.json({ message: "Failed to load image from DB" }, { status: 500 });
  }
}
