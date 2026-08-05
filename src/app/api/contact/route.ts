import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { validateContact } from "@/schemas/contact.schema";
import { sendMail } from "@/services/email/email.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side input validation
    const { error, value } = validateContact({
      name: body.name,
      email: body.email,
      category: body.service,
      message: body.message,
      consent: true,
    });

    if (error || !value) {
      return NextResponse.json({ message: error || "Validation failed" }, { status: 400 });
    }

    const { name, email, category, message } = value;
    const company = body.company || '';
    const employee_count = body.employee_count || null;
    const division_status = body.division_status || null;
    const company_count = body.company_count || null;

    const pool = await getDbConnection();
    
    // Save to database
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('company', sql.NVarChar, company)
      .input('service', sql.NVarChar, category)
      .input('message', sql.NVarChar, message)
      .input('employee_count', sql.NVarChar, employee_count)
      .input('division_status', sql.NVarChar, division_status)
      .input('company_count', sql.NVarChar, company_count)
      .query(`
        INSERT INTO inquiries 
        (name, email, company, service, message, employee_count, division_status, company_count) 
        VALUES 
        (@name, @email, @company, @service, @message, @employee_count, @division_status, @company_count)
      `);

    // --- Send Email Notification using centralized service ---
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Website Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Interest:</strong> ${category}</p>
        
        ${category === 'Smart HRIS' ? `
          <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1e40af;">Product Specific Details:</h4>
            <p><strong>Employees:</strong> ${employee_count}</p>
            <p><strong>Multi-Company:</strong> ${company_count}</p>
            <p><strong>Hierarchy/Designations:</strong> ${division_status}</p>
          </div>
        ` : ''}

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
        
        <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; text-align: center;">
          This message was sent from the FIDA Global website contact form.
        </p>
      </div>
    `;

    await sendMail({
      to: "info@fidaglobal.com",
      subject: `New Lead: ${category} from ${name}`,
      replyTo: email,
      html: htmlContent
    });

    return NextResponse.json({ message: "Success! Your message has been recorded and our team will get back to you shortly." });
  } catch (error: any) {
    console.error("Contact Form Database Error:", error);
    return NextResponse.json({ 
      message: "An internal error occurred. Please try again later.", 
      error: error.message 
    }, { status: 500 });
  }
}
