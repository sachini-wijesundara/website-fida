export function getAdminAlertHtml(subject: string, errorMsg: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: #DC2626;">System Alert Notification</h2>
      <p><strong>Alert Event:</strong> ${subject}</p>
      <p><strong>Log Details:</strong></p>
      <div style="background: #FEF2F2; padding: 15px; border-radius: 8px; border-left: 4px solid #DC2626; color: #991B1B; font-family: monospace; font-size: 13px; margin-top: 10px;">
        ${errorMsg}
      </div>
      <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
      <small style="color: #6B7280;">Critical system monitor event log.</small>
    </div>
  `;
}
