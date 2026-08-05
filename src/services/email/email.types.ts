export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}
