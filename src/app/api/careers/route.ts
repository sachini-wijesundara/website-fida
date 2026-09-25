export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { validateCareerApplication } from "@/schemas/career.schema";
import { sendMail } from "@/services/email/email.service";
import { getApplicationConfirmationHtml } from "@/services/email/templates/application-confirmation";

// GET active careers for public listing
export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(
      "SELECT id, title, dept, type, location, color, is_active, created_at FROM careers WHERE is_active = 1 ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error: any) {
    console.error("GET /api/careers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST to apply for a career
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Map uppercase/lowercase keys if needed
    const payload = {
      FullName: data.FullName || data.fullName,
      Email: data.Email || data.email,
      Phone: data.Phone || data.phone,
      Position: data.Position || data.position,
      ResumeUrl: data.ResumeUrl || data.resumeUrl,
      Message: data.Message || data.message,
    };

    const { error, value } = validateCareerApplication(payload);
    if (error || !value) {
      return NextResponse.json({ message: error || "Validation failed" }, { status: 400 });
    }

    const { fullName, email, phone, position, resumeUrl, message } = value;
    const pool = await getDbConnection();

    const result = await pool.request()
      .input("FullName", sql.NVarChar(255), fullName)
      .input("Email", sql.NVarChar(255), email)
      .input("Phone", sql.NVarChar(50), phone || null)
      .input("Position", sql.NVarChar(255), position)
      .input("ResumeUrl", sql.NVarChar(sql.MAX), resumeUrl || null)
      .input("Message", sql.NVarChar(sql.MAX), message || null)
      .execute("sp_CreateJobApplication");

    // Send confirmation email asynchronously
    try {
      const confirmationHtml = getApplicationConfirmationHtml(fullName, position);
      await sendMail({
        to: email,
        subject: `Application Received: ${position} at FIDA Global`,
        html: confirmationHtml,
      });
    } catch (mailErr) {
      console.warn("Mail send notice:", mailErr);
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId: result.recordset?.[0]?.ApplicationId,
    });
  } catch (error: any) {
    console.error("POST /api/careers error:", error);
    return NextResponse.json({ message: "Failed to submit application", error: error.message }, { status: 500 });
  }
}
