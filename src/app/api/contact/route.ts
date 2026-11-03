export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { validateContact } from "@/schemas/contact.schema";
import { sendMail } from "@/services/email/email.service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function escapeHtml(str: any): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Spam & Flooding Protection: Max 5 submissions per 10 minutes per IP
    const { allowed } = rateLimit(`contact:${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });

    if (!allowed) {
      return NextResponse.json(
        { message: "Too many submissions from your connection. Please wait a few minutes before submitting again." },
        { status: 429 }
      );
    }

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
      .input('name', name)
      .input('email', email)
      .input('company', company)
      .input('service', category)
      .input('message', message)
      .input('employee_count', employee_count)
      .input('division_status', division_status)
      .input('company_count', company_count)
      .query(`
        INSERT INTO inquiries 
        (name, email, company, service, message, employee_count, division_status, company_count) 
        VALUES 
        (@name, @email, @company, @service, @message, @employee_count, @division_status, @company_count)
      `);

    // --- Send Email Notification to info@fidaglobal.com with HTML escaping ---
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safeCategory = escapeHtml(category);
    const safeMessage = escapeHtml(message);
    const safeEmployeeCount = escapeHtml(employee_count);
    const safeCompanyCount = escapeHtml(company_count);
    const safeDivisionStatus = escapeHtml(division_status);

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "info@fidaglobal.com";
    const emailSubject = `📬 New Contact Message: ${safeName}${safeCompany ? ` (${safeCompany})` : ""} - ${safeCategory}`;
    const formattedTimestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(5, 44, 101, 0.08); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #052c65 0%, #0a3d82 60%, #0047e1 100%); padding: 32px 28px; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;">
                      New Contact Message
                    </span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.3;">
                      Customer Message from Website
                    </h1>
                    <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">
                      Received on ${formattedTimestamp} (Sri Lanka Time)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px;">
              <!-- Sender Overview Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; width: 140px; font-size: 13px; font-weight: 700; color: #475569;">Full Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #475569;">Work Email:</td>
                        <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">
                          <a href="mailto:${safeEmail}" style="color: #0047e1; text-decoration: underline;">${safeEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #475569;">Company:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 500;">${safeCompany || "Not specified"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #475569;">Service:</td>
                        <td style="padding: 6px 0; font-size: 13px;">
                          <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 6px; font-weight: 700;">
                            ${safeCategory}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${category === "Smart HRIS" ? `
                <!-- Smart HRIS Additional Info -->
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                  <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">
                    Smart HRIS Requirements
                  </h3>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                    <tr>
                      <td style="padding: 4px 0; width: 160px; color: #3b82f6; font-weight: 600;">Approx. Employees:</td>
                      <td style="padding: 4px 0; color: #1e3a8a; font-weight: 700;">${safeEmployeeCount || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #3b82f6; font-weight: 600;">No. of Companies:</td>
                      <td style="padding: 4px 0; color: #1e3a8a; font-weight: 700;">${safeCompanyCount || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #3b82f6; font-weight: 600;">Multi-Company Logic:</td>
                      <td style="padding: 4px 0; color: #1e3a8a; font-weight: 700;">${safeDivisionStatus || "N/A"}</td>
                    </tr>
                  </table>
                </div>
              ` : ""}

              <!-- Customer Message Section -->
              <div style="margin-bottom: 28px;">
                <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 800;">
                  Message Content
                </h3>
                <div style="background: #f8fafc; border-left: 4px solid #0047e1; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 18px 20px; border-radius: 0 10px 10px 0; font-size: 14px; line-height: 1.7; color: #1e293b; white-space: pre-wrap;">
${safeMessage}
                </div>
              </div>

              <!-- Quick Reply CTA Button -->
              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: Your message to FIDA Global - ${category}`)}" style="display: inline-block; background: #0047e1; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 13px 28px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0, 71, 225, 0.25);">
                  Reply to ${safeName} &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 4px;">
                This message was sent from the <strong>FIDA Global Website</strong> contact form.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                You can also reply directly to this email &mdash; the reply will be delivered to <strong>${safeEmail}</strong>.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Dispatch email notification
    try {
      await sendMail({
        to: receiverEmail,
        subject: emailSubject,
        replyTo: email,
        html: htmlContent,
      });
      console.log(`[Contact API] Notification email dispatched successfully to ${receiverEmail}`);
    } catch (mailErr: any) {
      console.error("[Contact API] Failed to send notification email:", mailErr?.message || mailErr);
      // We log but do not fail the request since customer lead is safely saved in the database
    }

    return NextResponse.json({ 
      message: "Success! Your message has been recorded and our team will get back to you shortly." 
    });
  } catch (error: any) {
    console.error("Contact Form Database Error:", error);
    return NextResponse.json({ 
      message: "An internal error occurred. Please try again later.", 
      error: error.message 
    }, { status: 500 });
  }
}
