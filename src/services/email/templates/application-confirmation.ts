export function getApplicationConfirmationHtml(name: string, jobTitle: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
      <div style="background-color: #0B192C; background: #0B192C; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h2 style="color: #ffffff !important; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em;">Application Received - FIDA Global</h2>
      </div>
      <p style="margin-top: 0; font-size: 15px;">Dear ${name},</p>
      <p style="font-size: 15px;">Thank you for submitting your application for the <strong>${jobTitle}</strong> position at FIDA Global. We have received your CV and details.</p>
      <p style="font-size: 15px;">Our recruitment team will review your application and get in touch with you if your qualifications match the role specifications.</p>
      <p style="margin-top: 24px; font-size: 15px;">Best regards,<br/><strong>FIDA Global Careers Team</strong></p>
      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <small style="color: #6B7280; font-size: 13px;">Please do not reply directly to this automated email confirmation.</small>
    </div>
  `;
}
