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
      .input('FullName', fullName)
      .input('Email', email)
      .input('Phone', phone || null)
      .input('Position', position)
      .input('ResumeUrl', resumeUrl || null)
      .input('Message', message || null)
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
    try {
      await pool.request()
        .input('ApplicationId', parseInt(id, 10))
        .input('Status', String(status))
        .execute('sp_UpdateJobApplicationStatus');
    } catch (spErr) {
      await pool.request()
        .input('ApplicationId', parseInt(id, 10))
        .input('Status', String(status))
        .query('UPDATE JobApplications SET Status = @Status WHERE ApplicationId = @ApplicationId');
    }

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
    try {
      await pool.request()
        .input('ApplicationId', parseInt(id, 10))
        .execute('sp_DeleteJobApplication');
    } catch (spErr) {
      await pool.request()
        .input('ApplicationId', parseInt(id, 10))
        .query('DELETE FROM JobApplications WHERE ApplicationId = @ApplicationId');
    }

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete application", error: error.message }, { status: 500 });
  }
}
