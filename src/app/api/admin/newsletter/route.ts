export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();

    // Auto-create table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='newsletter_subscribers' AND xtype='U')
      CREATE TABLE newsletter_subscribers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        subscribed_at DATETIME NOT NULL DEFAULT GETDATE()
      )
    `);

    const result = await pool.request().query(`
      SELECT id, email, subscribed_at
      FROM newsletter_subscribers
      ORDER BY subscribed_at DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("Newsletter list error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const pool = await getDbConnection();
    await pool.request().input("id", id).query(`DELETE FROM newsletter_subscribers WHERE id = @id`);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("Newsletter delete error:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
