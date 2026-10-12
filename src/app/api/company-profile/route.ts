export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='company_profile' AND xtype='U')
      BEGIN
        SELECT TOP 1 * FROM company_profile WHERE is_active = 1 ORDER BY updated_at DESC;
      END
    `);

    const activeProfile = result.recordset && result.recordset.length > 0 
      ? result.recordset[0] 
      : {
          title: "FIDA Global Corporate Profile 2026",
          version: "2026 Edition",
          file_url: "/Company%20Profile%202026.pdf",
          file_name: "Company Profile 2026.pdf",
          file_size: "62.9 MB",
        };

    return NextResponse.json({
      success: true,
      data: activeProfile,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: {
        title: "FIDA Global Corporate Profile 2026",
        version: "2026 Edition",
        file_url: "/Company%20Profile%202026.pdf",
        file_name: "Company Profile 2026.pdf",
        file_size: "62.9 MB",
      },
    });
  }
}
