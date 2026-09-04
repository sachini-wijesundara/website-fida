export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT * FROM YouTubeLinks ORDER BY CreatedAt DESC');
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { YouTubeURL, Sector } = await req.json();

    if (!YouTubeURL) {
      return NextResponse.json({ success: false, message: "YouTubeURL is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input("YouTubeURL", sql.NVarChar, YouTubeURL)
      .input("Sector", sql.NVarChar, Sector || null)
      .query(`
        INSERT INTO YouTubeLinks (YouTubeURL, Sector, CreatedAt)
        VALUES (@YouTubeURL, @Sector, GETDATE())
      `);

    return NextResponse.json({ success: true, message: "YouTube link added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
       return NextResponse.json({ success: false, message: "Missing LinkID" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM YouTubeLinks WHERE LinkID = @id');

    return NextResponse.json({ success: true, message: "YouTube link deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
