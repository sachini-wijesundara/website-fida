export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

import { validateCareerApplication } from "@/schemas/career.schema";
import { sendMail } from "@/services/email/email.service";
import { getApplicationConfirmationHtml } from "@/services/email/templates/application-confirmation";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllJobApplications');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch job applications", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Server-side validation
    const { error, value } = validateCareerApplication(data);
    if (error || !value) {
      return NextResponse.json({ message: error || "Validation failed" }, { status: 400 });
    }

    const { fullName, email, phone, position, resumeUrl, message } = value;

    const pool = await getDbConnection();

    const result = await pool.request()
      .input('FullName', sql.NVarChar(255), fullName)
      .input('Email', sql.NVarChar(255), email)
      .input('Phone', sql.NVarChar(50), phone || null)
      .input('Position', sql.NVarChar(255), position)
      .input('ResumeUrl', sql.NVarChar(sql.MAX), resumeUrl || null)
      .input('Message', sql.NVarChar(sql.MAX), message || null)
      .execute('sp_CreateJobApplication');

    // Send confirmation email
    const confirmationHtml = getApplicationConfirmationHtml(fullName, position);
    await sendMail({
      to: email,
      subject: `Application Received: ${position} at FIDA Global`,
      html: confirmationHtml
    });

    return NextResponse.json({ message: "Application submitted successfully", applicationId: result.recordset[0].ApplicationId });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to submit application", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;
    
    if (!id || !status) {
      return NextResponse.json({ message: "ID and Status are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ApplicationId', sql.Int, id)
      .input('Status', sql.NVarChar(50), status)
      .execute('sp_UpdateJobApplicationStatus');

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update status", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Application ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ApplicationId', sql.Int, id)
      .execute('sp_DeleteJobApplication');

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete application", error: error.message }, { status: 500 });
  }
}
