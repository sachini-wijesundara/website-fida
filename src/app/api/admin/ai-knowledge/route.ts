export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT * FROM ai_knowledge_base ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { category, title, content } = await req.json();

    if (!category || !title || !content) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input("category", sql.NVarChar, category)
      .input("title", sql.NVarChar, title)
      .input("content", sql.NVarChar, content)
      .query(`
        INSERT INTO ai_knowledge_base (category, title, content, is_active, created_at)
        VALUES (@category, @title, @content, 1, GETDATE())
      `);

    return NextResponse.json({ success: true, message: "Knowledge base entry added successfully" });
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
      .query('DELETE FROM ai_knowledge_base WHERE id = @id');

    return NextResponse.json({ success: true, message: "Entry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
