export function getNewsletterWelcomeHtml(email: string): string {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>Thank You for Subscribing to FIDA Global</title>
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
        @media (prefers-color-scheme: dark) {
          .email-bg { background-color: #0b1528 !important; }
          .email-card { background-color: #162238 !important; border-color: #263859 !important; }
          .email-heading { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
          .email-subheading { color: #94a3b8 !important; }
          .email-body { color: #f1f5f9 !important; }
          .email-body p { color: #f1f5f9 !important; }
          .email-highlight-box { background-color: #1a2a47 !important; border-color: #263859 !important; }
          .email-highlight-title { color: #38bdf8 !important; }
          .email-highlight-desc { color: #cbd5e1 !important; }
          .email-footer-bg { background-color: #0b1528 !important; border-top-color: #263859 !important; }
          .email-footer-text { color: #94a3b8 !important; }
          .email-brand-tag { background-color: #1e3a8a !important; color: #93c5fd !important; }
        }
      </style>
    </head>
    <body class="email-bg" style="margin: 0; padding: 0; background-color: #f1f5f9; color: #334155;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-bg" style="background-color: #f1f5f9; padding: 36px 16px;">
        <tr>
          <td align="center">
            <!-- Main Card Container -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(5, 44, 101, 0.08); border: 1px solid #e2e8f0;">
              
              <!-- Clean Minimal Top Accent Line -->
              <tr>
                <td height="4" bgcolor="#0047e1" style="background-color: #0047e1; line-height: 4px; font-size: 4px;">&nbsp;</td>
              </tr>

              <!-- Header Bar (Clean White Background with High Contrast Typography) -->
              <tr>
                <td style="padding: 36px 36px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <!-- Brand Badge -->
                        <div style="margin-bottom: 16px;">
                          <span class="email-brand-tag" style="display: inline-block; padding: 6px 14px; background-color: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                            FIDA Global Newsletter
                          </span>
                        </div>
                        
                        <!-- Main Title (Crisp, High-Contrast) -->
                        <h1 class="email-heading" style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25;">
                          Thank You for Subscribing!
                        </h1>
                        <p class="email-subheading" style="color: #64748b; margin: 8px 0 0; font-size: 14px; font-weight: 500;">
                          We&apos;re excited to have you join our community.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Subtle Divider -->
              <tr>
                <td style="padding: 0 36px;">
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;">
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td class="email-body" style="padding: 28px 36px 24px; font-size: 15px; line-height: 1.7; color: #334155;">
                  <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: inherit;">
                    Hello,
                  </p>
                  <p style="margin: 0 0 20px; line-height: 1.7; color: inherit;">
                    Thank you for subscribing to the <strong>FIDA Global</strong> newsletter with <strong style="color: #0047e1;">${email}</strong>. You are now on the list to receive our latest updates and industry perspectives.
                  </p>
                  <p style="margin: 0 0 20px; line-height: 1.7; color: inherit;">
                    Here is what you can look forward to in our upcoming editions:
                  </p>

                  <!-- Highlight Cards (Clean Pastel Backgrounds with Strong Text) -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                    <tr>
                      <td class="email-highlight-box" style="padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #0047e1; border-radius: 0 10px 10px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <strong class="email-highlight-title" style="color: #052c65; font-size: 14px; display: block; margin-bottom: 4px;">
                          💡 Technology &amp; Workplace Trends
                        </strong>
                        <span class="email-highlight-desc" style="font-size: 13px; color: #64748b; line-height: 1.5; display: block;">
                          Actionable insights into digital transformation, Smart HRIS, attendance automation, and enterprise ICT.
                        </span>
                      </td>
                    </tr>
                    <tr><td height="10"></td></tr>
                    <tr>
                      <td class="email-highlight-box" style="padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #167fa8; border-radius: 0 10px 10px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <strong class="email-highlight-title" style="color: #052c65; font-size: 14px; display: block; margin-bottom: 4px;">
                          🚀 Product Updates &amp; Innovations
                        </strong>
                        <span class="email-highlight-desc" style="font-size: 13px; color: #64748b; line-height: 1.5; display: block;">
                          First-look announcements and feature highlights for the modern, distributed workforce.
                        </span>
                      </td>
                    </tr>
                    <tr><td height="10"></td></tr>
                    <tr>
                      <td class="email-highlight-box" style="padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #052c65; border-radius: 0 10px 10px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <strong class="email-highlight-title" style="color: #052c65; font-size: 14px; display: block; margin-bottom: 4px;">
                          📈 Expert Guides &amp; Case Studies
                        </strong>
                        <span class="email-highlight-desc" style="font-size: 13px; color: #64748b; line-height: 1.5; display: block;">
                          Real-world strategies and best practices for scaling operational efficiency.
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Primary CTA Button -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px;">
                    <tr>
                      <td align="center">
                        <a href="https://www.fidaglobal.com/solutions" target="_blank" style="display: inline-block; background-color: #0047e1; color: #ffffff !important; text-decoration: none; padding: 13px 32px; border-radius: 9999px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(0, 71, 225, 0.28);">
                          Explore Our Solutions &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Sign-off -->
                  <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: inherit;">
                      Warm regards,<br>
                      <strong style="color: #0047e1;">The FIDA Global Team</strong>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="email-footer-bg" bgcolor="#f8fafc" style="padding: 24px 36px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p class="email-footer-text" style="margin: 0 0 10px; font-size: 12px; color: #64748b; line-height: 1.6;">
                    You received this email because you subscribed to updates on <a href="https://www.fidaglobal.com" target="_blank" style="color: #0047e1; text-decoration: underline;">fidaglobal.com</a>.
                  </p>
                  <p class="email-footer-text" style="margin: 0 0 10px; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    FIDA Global (Pvt) Ltd &bull; No. 215 C, Raththanapitiya, Boralesgamuwa, 10290, Sri Lanka.<br>
                    Phone: +94 11 710 80 20 &bull; Email: <a href="mailto:info@fidaglobal.com" style="color: #64748b; text-decoration: underline;">info@fidaglobal.com</a>
                  </p>
                  <p class="email-footer-text" style="margin: 0; font-size: 11px; color: #94a3b8;">
                    &copy; ${currentYear} FIDA Global. All rights reserved. &bull; <a href="https://www.fidaglobal.com/terms" style="color: #94a3b8; text-decoration: underline;">Terms &amp; Conditions</a>
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
}
