export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let targetUrl = "/Company%20Profile%202026.pdf";
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='company_profile' AND xtype='U')
      BEGIN
        SELECT TOP 1 file_url FROM company_profile WHERE is_active = 1 ORDER BY updated_at DESC;
      END
    `);
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].file_url) {
      targetUrl = result.recordset[0].file_url;
    }
  } catch (err) {
    console.error("Error finding active company profile:", err);
  }

  return NextResponse.redirect(new URL(targetUrl, request.url));
}
