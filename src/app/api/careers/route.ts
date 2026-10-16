export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { validateCareerApplication } from "@/schemas/career.schema";
import { sendMail } from "@/services/email/email.service";
import { getApplicationConfirmationHtml } from "@/services/email/templates/application-confirmation";

// GET active careers for public listing
export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT id, title, dept, type, location, color, is_active, details, created_at 
      FROM careers 
      WHERE COALESCE(is_active, 1) = 1 
      ORDER BY created_at DESC
    `);

    return NextResponse.json(
      { success: true, data: result.recordset || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/careers error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
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

    let applicationId: any = null;

    try {
      const result = await pool.request()
        .input("FullName", fullName)
        .input("Email", email)
        .input("Phone", phone || null)
        .input("Position", position)
        .input("ResumeUrl", resumeUrl || null)
        .input("Message", message || null)
        .execute("sp_CreateJobApplication");

      applicationId = result.recordset?.[0]?.ApplicationId;
    } catch (spErr) {
      console.warn("sp_CreateJobApplication failed, trying fallback insert:", spErr);
      const direct = await pool.request()
        .input("FullName", fullName)
        .input("Email", email)
        .input("Phone", phone || null)
        .input("Position", position)
        .input("ResumeUrl", resumeUrl || null)
        .input("Message", message || null)
        .query(`
          INSERT INTO JobApplications (FullName, Email, Phone, Position, ResumeUrl, Message, Status, CreatedAt)
          OUTPUT INSERTED.ApplicationId
          VALUES (@FullName, @Email, @Phone, @Position, @ResumeUrl, @Message, 'pending', GETDATE())
        `);
      applicationId = direct.recordset?.[0]?.ApplicationId;
    }

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
      applicationId: applicationId,
    });
  } catch (error: any) {
    console.error("POST /api/careers error:", error);
    return NextResponse.json({ message: "Failed to submit application", error: error.message }, { status: 500 });
  }
}
