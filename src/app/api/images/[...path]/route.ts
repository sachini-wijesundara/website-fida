export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    let relativePath = params.path.join("/");
    // handle potential URL encoding
    relativePath = decodeURIComponent(relativePath);

    const pool = await getDbConnection();
    const result = await pool.request()
      .input("Title", relativePath)
      .query(`
        SELECT image_data
        FROM dbo.Images
        WHERE title = @Title
      `);
    const imageUrl = result.recordset[0]?.image_data as string | undefined;

    if (!imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

    if (!imageUrl.startsWith("data:")) {
      // If it's a regular URL, just redirect
      return NextResponse.redirect(new URL(imageUrl, request.url));
    }

    const match = imageUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/);
    if (!match) {
      return NextResponse.json({ message: "Invalid stored image" }, { status: 500 });
    }

    return new NextResponse(Buffer.from(match[2], "base64"), {
      headers: {
        "Content-Type": match[1],
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Project image error:", error);
    return NextResponse.json({ message: "Failed to load image from DB" }, { status: 500 });
  }
}
