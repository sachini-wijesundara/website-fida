/**
 * Simple audit logger to record administrative operations safely.
 * Ensure it doesn't log passwords or sensitive data.
 */
export function logAction(userId: string | number, action: string, details: any) {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT LOG] [${timestamp}] UserID=${userId} Action=${action} Details=${JSON.stringify(details)}`);
}
