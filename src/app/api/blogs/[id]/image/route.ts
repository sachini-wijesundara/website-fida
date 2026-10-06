export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("BlogId", id)
      .query("SELECT image_url FROM blogs WHERE id = @BlogId");

    if (!result.recordset || result.recordset.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const rawUrl: string = result.recordset[0].image_url;
    if (!rawUrl || rawUrl.trim() === "") {
      return new NextResponse("No image", { status: 404 });
    }

    // If it's a data URL (base64)
    if (rawUrl.startsWith("data:")) {
      const commaIndex = rawUrl.indexOf(",");
      if (commaIndex !== -1) {
        const meta = rawUrl.substring(5, commaIndex);
        const contentType = meta.split(";")[0] || "image/jpeg";
        const base64Data = rawUrl.substring(commaIndex + 1).replace(/\s/g, "");
        const buffer = Buffer.from(base64Data, "base64");

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }
    }

    // If it's an external HTTP/HTTPS URL, redirect directly
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return NextResponse.redirect(rawUrl, 307);
    }

    return new NextResponse("Unsupported image format", { status: 415 });
  } catch (error: any) {
    console.error("GET Blog Image Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
