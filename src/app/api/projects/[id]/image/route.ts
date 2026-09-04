export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = Number.parseInt(params.id, 10);
    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 });
    }

    const pool = await getDbConnection();
    const result = await pool.request()
      .input("ProjectId", projectId)
      .query(`
        SELECT image_url
        FROM dbo.projects
        WHERE id = @ProjectId
          AND image_url IS NOT NULL
          AND (status <> 'Deleted' OR status IS NULL);
      `);
    const imageUrl = result.recordset[0]?.image_url as string | undefined;

    if (!imageUrl) {
      return new NextResponse(null, { status: 404 });
    }

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
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Project image error:", error);
    return NextResponse.json({ message: "Failed to load project image" }, { status: 500 });
  }
}
