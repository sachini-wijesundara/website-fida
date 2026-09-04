export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT * FROM careers ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, dept, type, location, color } = await req.json();

    if (!title || !dept || !location || !type) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const themeColor = color || "var(--green)";

    const pool = await getDbConnection();
    await pool.request()
      .input("title", sql.NVarChar, title)
      .input("dept", sql.NVarChar, dept)
      .input("type", sql.NVarChar, type)
      .input("location", sql.NVarChar, location)
      .input("color", sql.NVarChar, themeColor)
      .query(`
        INSERT INTO careers (title, dept, type, location, color, is_active, created_at)
        VALUES (@title, @dept, @type, @location, @color, 1, GETDATE())
      `);

    return NextResponse.json({ success: true, message: "Career entry added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
       return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM careers WHERE id = @id');

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
