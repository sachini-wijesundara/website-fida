import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import sharp from "sharp";

export const dynamic = "force-dynamic";

function parseDataUri(rawUrl: string): { mimeType: string; buffer: Buffer } | null {
  try {
    const commaIdx = rawUrl.indexOf(",");
    if (commaIdx === -1) return null;
    const header = rawUrl.substring(0, commaIdx);
    const mimeMatch = header.match(/data:([^;]+)/i);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64Data = rawUrl.substring(commaIdx + 1).replace(/\s/g, "");
    const buffer = Buffer.from(base64Data, "base64");
    return { mimeType, buffer };
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await getDbConnection();
    const result = await pool.request()
      .input("id", parseInt(params.id, 10))
      .query("SELECT image_url FROM team_members WHERE id = @id");

    if (!result.recordset || result.recordset.length === 0) {
      return new NextResponse(null, { status: 404 });
    }

    const rawUrl = result.recordset[0].image_url;
    if (!rawUrl) {
      return new NextResponse(null, { status: 404 });
    }

    if (!rawUrl.startsWith("data:")) {
      return NextResponse.redirect(new URL(rawUrl, request.url));
    }

    const parsed = parseDataUri(rawUrl);
    if (!parsed || parsed.buffer.length === 0) {
      return new NextResponse(null, { status: 500 });
    }

    // Convert to webp with sharp for maximum compression & speed
    let outputBuffer: Buffer = parsed.buffer;
    let outputMime = parsed.mimeType;

    try {
      outputBuffer = await sharp(parsed.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      outputMime = "image/webp";
    } catch {
      // fallback to original if sharp fails
    }

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": outputMime,
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Team image route error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
