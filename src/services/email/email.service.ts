import { getTransporter } from "./providers/nodemailer.provider";
import { EmailPayload } from "./email.types";

export async function sendMail(payload: EmailPayload): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[MAIL DEV LOG] Transporter mock send to: ${payload.to}\nSubject: ${payload.subject}\nContent length: ${payload.html.length}`);
    return true; // Mock success in dev/unconfigured environment
  }

  let retries = 3;
  while (retries > 0) {
    try {
      await transporter.sendMail({
        from: `"FIDA Global Site" <${process.env.EMAIL_USER}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        replyTo: payload.replyTo,
      });
      return true;
    } catch (err) {
      retries--;
      console.error(`Mail dispatch failed. Retries left: ${retries}. Error:`, err);
      if (retries === 0) {
        throw new Error("SMTP dispatch timed out or credentials rejected after 3 attempts.");
      }
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay between retries
    }
  }
  return false;
}
