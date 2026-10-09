import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { ensureHeaderDbObjects, defaultTermsHeader } from "@/lib/terms-header";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getDbConnection();
    await ensureHeaderDbObjects(pool);

    const result = await pool.request().execute("sp_GetTermsHeader");
    if (result.recordset && result.recordset.length > 0) {
      return NextResponse.json(result.recordset[0]);
    }
    return NextResponse.json(defaultTermsHeader);
  } catch (error: any) {
    console.error("GET Terms Header error:", error);
    return NextResponse.json(defaultTermsHeader);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      company_version,
      website_url,
      effective_date,
      intro_text,
    } = body;

    const pool = await getDbConnection();
    await ensureHeaderDbObjects(pool);

    const result = await pool.request()
      .input("Title", title || "FIDA Global Website Terms and Conditions")
      .input("Subtitle", subtitle || "")
      .input("CompanyVersion", company_version || "")
      .input("WebsiteUrl", website_url || "")
      .input("EffectiveDate", effective_date || "")
      .input("IntroText", intro_text || "")
      .execute("sp_UpsertTermsHeader");

    return NextResponse.json({
      message: "Terms header updated successfully",
      data: result.recordset?.[0] || body,
    });
  } catch (error: any) {
    console.error("POST Terms Header error:", error);
    return NextResponse.json(
      { message: "Failed to update terms header", error: error.message },
      { status: 500 }
    );
  }
}
