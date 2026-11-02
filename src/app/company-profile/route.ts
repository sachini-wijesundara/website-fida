export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  let targetUrl = "/Company%20Profile%202026.pdf";
  let fileName = "Company Profile 2026.pdf";

  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='company_profile' AND xtype='U')
      BEGIN
        SELECT TOP 1 id, file_url, file_name FROM company_profile WHERE is_active = 1 ORDER BY updated_at DESC;
      END
    `);

    if (result.recordset && result.recordset.length > 0 && result.recordset[0].file_url) {
      targetUrl = result.recordset[0].file_url;
      fileName = result.recordset[0].file_name || fileName;

      // Increment download counter asynchronously
      pool.request()
        .input("id", result.recordset[0].id)
        .query("UPDATE company_profile SET download_count = download_count + 1 WHERE id = @id")
        .catch(() => {});
    }
  } catch (err) {
    console.error("Error finding active company profile:", err);
  }

  // 1. Try serving the active profile file directly from disk (zero redirect)
  const cleanPath = decodeURIComponent(targetUrl.replace(/^\//, ""));
  const filePath = path.join(process.cwd(), "public", cleanPath);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (fileErr) {
    // 2. Fallback to default Company Profile 2026.pdf if custom upload not found
    try {
      const fallbackPath = path.join(process.cwd(), "public", "Company Profile 2026.pdf");
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new NextResponse(new Uint8Array(fallbackBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="Company Profile 2026.pdf"',
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (fallbackErr) {
      // 3. Fallback redirect using proxy-safe host header if direct read fails
      const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
      const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      return NextResponse.redirect(new URL(targetUrl, `${proto}://${host}`));
    }
  }
}
