// No `export const dynamic` — let Next.js use its default (static where possible)
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// ── In-memory & disk image cache ──────────────────────────────────────────
const IMAGE_CACHE = new Map<string, { buffer: Buffer; mimeType: string; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_MAX = 500;

const DISK_CACHE_DIR = path.join(process.cwd(), ".cache", "fida-images");

function ensureDiskCacheDir() {
  try {
    if (!fs.existsSync(DISK_CACHE_DIR)) {
      fs.mkdirSync(DISK_CACHE_DIR, { recursive: true });
    }
  } catch {}
}

function getDiskCachePath(key: string, variant = "orig"): { filePath: string; metaPath: string } {
  const safeKey = Buffer.from(`${key}_${variant}`).toString("hex");
  return {
    filePath: path.join(DISK_CACHE_DIR, `${safeKey}.bin`),
    metaPath: path.join(DISK_CACHE_DIR, `${safeKey}.meta`),
  };
}

function getCached(key: string, variant = "orig"): { buffer: Buffer; mimeType: string } | null {
  const cacheKey = `${key}:${variant}`;
  // 1. Memory check
  const entry = IMAGE_CACHE.get(cacheKey);
  if (entry) {
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      IMAGE_CACHE.delete(cacheKey);
    } else {
      return { buffer: entry.buffer, mimeType: entry.mimeType };
    }
  }

  // 2. Disk check
  try {
    const { filePath, metaPath } = getDiskCachePath(key, variant);
    if (fs.existsSync(filePath) && fs.existsSync(metaPath)) {
      const buffer = fs.readFileSync(filePath);
      const mimeType = fs.readFileSync(metaPath, "utf8").trim() || "image/jpeg";
      setCached(key, variant, buffer, mimeType, false);
      return { buffer, mimeType };
    }
  } catch {}

  return null;
}

function setCached(key: string, variant: string, buffer: Buffer, mimeType: string, writeToDisk = true) {
  const cacheKey = `${key}:${variant}`;
  if (IMAGE_CACHE.size >= CACHE_MAX) {
    const firstKey = IMAGE_CACHE.keys().next().value;
    if (firstKey !== undefined) IMAGE_CACHE.delete(firstKey);
  }
  IMAGE_CACHE.set(cacheKey, { buffer, mimeType, ts: Date.now() });

  if (writeToDisk) {
    try {
      ensureDiskCacheDir();
      const { filePath, metaPath } = getDiskCachePath(key, variant);
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

    const acceptHeader = request.headers.get("accept") || "";
    const wantsWebp = acceptHeader.includes("image/webp") || acceptHeader.includes("*/*");

    const CACHE_HEADERS: Record<string, string> = {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Vary": "Accept",
    };

    const etagVariant = wantsWebp ? "webp" : "orig";
    const etag = `"${relativePath.replace(/[^a-z0-9]/gi, "_")}_${etagVariant}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new NextResponse(null, { status: 304, headers: { ...CACHE_HEADERS, ETag: etag } });
    }

    // ── 1. Check WebP cache if requested ───────────────────────────────────
    if (wantsWebp) {
      const cachedWebp = getCached(relativePath, "webp");
      if (cachedWebp) {
        return new NextResponse(new Uint8Array(cachedWebp.buffer), {
          headers: { "Content-Type": "image/webp", ...CACHE_HEADERS, ETag: etag },
        });
      }
    }

    // ── 2. Check original cache ───────────────────────────────────────────
    let origBuffer: Buffer | null = null;
    let origMimeType = "image/jpeg";

    const cachedOrig = getCached(relativePath, "orig");
    if (cachedOrig) {
      origBuffer = cachedOrig.buffer;
      origMimeType = cachedOrig.mimeType;
    } else {
      // ── Fetch from DB ───────────────────────────────────────────────────
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

      origBuffer = parsed.buffer;
      origMimeType = parsed.mimeType;

      // Store original in cache
      setCached(relativePath, "orig", origBuffer, origMimeType, true);
    }

    // ── 3. Optimize to WebP if supported and image is compressable ────────
    if (wantsWebp && (origMimeType === "image/png" || origMimeType === "image/jpeg" || origMimeType === "image/jpg")) {
      try {
        const webpBuffer = await sharp(origBuffer)
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        // Cache the optimized WebP
        setCached(relativePath, "webp", webpBuffer, "image/webp", true);

        return new NextResponse(new Uint8Array(webpBuffer), {
          headers: {
            "Content-Type": "image/webp",
            ...CACHE_HEADERS,
            ETag: etag,
          },
        });
      } catch (sharpError) {
        // Fall back to original on Sharp compression error
        console.warn("Sharp WebP optimization fallback for", relativePath, sharpError);
      }
    }

    // Return original image
    return new NextResponse(new Uint8Array(origBuffer), {
      headers: {
        "Content-Type": origMimeType,
        ...CACHE_HEADERS,
        ETag: etag,
      },
    });
  } catch (error: any) {
    console.error("Image API error:", error);
    return NextResponse.json({ message: "Failed to load image from DB" }, { status: 500 });
  }
}
