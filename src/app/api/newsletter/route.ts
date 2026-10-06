export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { sendMail } from "@/services/email/email.service";

async function ensureTable() {
  const pool = await getDbConnection();
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='newsletter_subscribers' AND xtype='U')
    CREATE TABLE newsletter_subscribers (
      id INT IDENTITY(1,1) PRIMARY KEY,
      email NVARCHAR(255) NOT NULL UNIQUE,
      subscribed_at DATETIME NOT NULL DEFAULT GETDATE()
    )
  `);
  return pool;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const pool = await ensureTable();

    // Check if already subscribed
    const existing = await pool
      .request()
      .input("email", email)
      .query(`SELECT id FROM newsletter_subscribers WHERE email = @email`);

    if (existing.recordset.length > 0) {
      return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 });
    }

    // Save to database
    await pool
      .request()
      .input("email", email)
      .query(`
        INSERT INTO newsletter_subscribers (email, subscribed_at)
        VALUES (@email, GETDATE())
      `);

    // Notify team
    await sendMail({
      to: "info@fidaglobal.com",
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Newsletter Subscriber</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px; text-align: center;">
            Subscribed via the FIDA Global website footer.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Subscribed! Thanks for joining." }, { status: 201 });
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
