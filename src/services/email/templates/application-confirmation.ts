export function getApplicationConfirmationHtml(name: string, jobTitle: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: #059669;">Application Received - FIDA Global</h2>
      <p>Dear ${name},</p>
      <p>Thank you for submitting your application for the <strong>${jobTitle}</strong> position at FIDA Global. We have received your CV and details.</p>
      <p>Our recruitment team will review your application and get in touch with you if your qualifications match the role specifications.</p>
      <p>Best regards,<br/><strong>FIDA Global Careers Team</strong></p>
      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
      <small style="color: #6B7280;">Please do not reply directly to this automated email confirmation.</small>
    </div>
  `;
}
