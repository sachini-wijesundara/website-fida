export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    
    // Fetch users with non-sensitive information
    const result = await pool.request()
      .query('SELECT id, username, COALESCE(email, \'No Email\') as email, COALESCE(role, \'Staff\') as role, COALESCE(status, \'Active\') as status, created_at FROM users ORDER BY created_at DESC');

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("List Users API Error:", error);
    return NextResponse.json({ message: "Failed to fetch users", error: error.message }, { status: 500 });
  }
}
