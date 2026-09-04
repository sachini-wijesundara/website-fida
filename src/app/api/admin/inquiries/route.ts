export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request()
      .query('SELECT * FROM inquiries ORDER BY created_at DESC');

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("List Inquiries API Error:", error);
    return NextResponse.json({ message: "Failed to fetch inquiries" }, { status: 500 });
  }
}
