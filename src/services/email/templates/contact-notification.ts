export function getContactNotificationHtml(name: string, email: string, category: string, message: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: #2563EB;">New Contact Inquiry - FIDA Global Site</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; border-left: 4px solid #2563EB; margin-top: 10px;">
        ${message}
      </div>
      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
      <small style="color: #6B7280;">This message was generated dynamically from the FIDA Global Website contact form.</small>
    </div>
  `;
}
