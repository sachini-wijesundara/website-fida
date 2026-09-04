export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllTimeline');
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to fetch timeline", error: error.message }, { status: 500 });
  }
}
