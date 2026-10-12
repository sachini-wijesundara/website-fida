export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { sendMail } from "@/services/email/email.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, name, subject, message } = body;

    if (!to || !to.trim()) {
      return NextResponse.json({ message: "Recipient email is required" }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ message: "Reply message cannot be empty" }, { status: 400 });
    }

    const replySubject = (subject || "").trim() || "Message from FIDA Global";
    const currentYear = new Date().getFullYear();

    // Format message lines cleanly
    const formattedMessage = message
      .trim()
      .split("\n")
      .map((line: string) => {
        const trimmed = line.trim();
        return trimmed 
          ? `<p style="margin: 0 0 14px; line-height: 1.7; font-size: 15px; color: inherit;">${trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` 
          : `<div style="height: 10px;"></div>`;
      })
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title>${replySubject}</title>
        <style>
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          /* Prevent iOS Apple Mail and Gmail from turning phone numbers and emails purple */
          a, a:link, a:visited, a:hover, a:active {
            color: #0047e1 !important;
            text-decoration: none !important;
          }
          a[x-apple-data-detectors],
          span.MsoHyperlink,
          span.MsoHyperlinkFollowed {
            color: #0047e1 !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          u + #body a,
          #MessageViewBody a {
            color: #0047e1 !important;
            text-decoration: none !important;
          }
          @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #0b1528 !important; }
            .email-card { background-color: #162238 !important; border-color: #263859 !important; }
            .email-header-title { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
            .email-header-motto { color: #38bdf8 !important; -webkit-text-fill-color: #38bdf8 !important; }
            .email-body { color: #f1f5f9 !important; background-color: #162238 !important; }
            .email-body p { color: #f1f5f9 !important; }
            .email-team-name { color: #ffffff !important; }
            .email-team-sub { color: #94a3b8 !important; }
            .email-team-sub a, .email-team-sub span, .email-team-sub font { color: #38bdf8 !important; }
            .email-footer-bg { background-color: #0b1528 !important; border-top-color: #263859 !important; }
            .email-footer-text { color: #94a3b8 !important; }
          }
        </style>
      </head>
      <body class="email-bg" style="margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-bg" style="background-color: #f1f5f9; padding: 36px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(5, 44, 101, 0.08); border: 1px solid #e2e8f0;">
                
                <!-- Clean Top FIDA Blue Accent Line -->
                <tr>
                  <td height="4" bgcolor="#0047e1" style="background-color: #0047e1; line-height: 4px; font-size: 4px;">&nbsp;</td>
                </tr>

                <!-- Header (Clean White Card Header with Crisp FIDA Branding) -->
                <tr>
                  <td style="padding: 32px 36px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <div class="email-header-title" style="color: #052c65; font-size: 22px; font-weight: 800; letter-spacing: -0.01em; margin: 0; line-height: 1.2;">
                            FIDA Global
                          </div>
                          <div class="email-header-motto" style="color: #0047e1; font-size: 11px; font-weight: 700; margin-top: 6px; letter-spacing: 0.1em; text-transform: uppercase;">
                            Business Partner For Success And Beyond
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 36px;">
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td class="email-body" style="padding: 30px 36px 24px; font-size: 15px; color: #1e293b; line-height: 1.7; background-color: #ffffff;">
                    
                    <!-- Direct message text -->
                    <div style="line-height: 1.7;">
                      ${formattedMessage}
                    </div>

                    <!-- Sign-off Block -->
                    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                      <div class="email-team-name" style="font-size: 15px; font-weight: 800; color: #052c65;">
                        FIDA Global Team
                      </div>
                      <div class="email-team-sub" style="font-size: 13px; color: #64748b; margin-top: 6px; line-height: 1.6;">
                        Email: <a href="mailto:info@fidaglobal.com" style="color: #0047e1 !important; text-decoration: none !important; font-weight: 600;"><span style="color: #0047e1 !important;"><font color="#0047e1">info@fidaglobal.com</font></span></a>
                        &nbsp;&bull;&nbsp;
                        Tel: <a href="tel:+94117108020" style="color: #0047e1 !important; text-decoration: none !important; font-weight: 600;"><span style="color: #0047e1 !important;"><font color="#0047e1">+94 11 710 80 20</font></span></a>
                      </div>
                    </div>

                  </td>
                </tr>

                <!-- Footer Block -->
                <tr>
                  <td class="email-footer-bg" bgcolor="#f8fafc" style="padding: 22px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p class="email-footer-text" style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      FIDA Global (Pvt) Ltd &bull; No. 215 C, Raththanapitiya, Boralesgamuwa, Sri Lanka<br>
                      &copy; ${currentYear} FIDA Global. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendMail({
      to: to.trim(),
      subject: replySubject,
      html: emailHtml,
      replyTo: "info@fidaglobal.com",
    });

    return NextResponse.json({
      success: true,
      message: `Reply sent successfully to ${to.trim()}!`,
    });
  } catch (error: any) {
    console.error("Direct reply email error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send email reply. Please check SMTP settings." },
      { status: 500 }
    );
  }
}
