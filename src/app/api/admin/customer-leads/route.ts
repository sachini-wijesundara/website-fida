export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM inquiries ORDER BY created_at DESC");

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("List Customer Leads Error:", error);
    return NextResponse.json({ message: "Failed to fetch customer leads" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Lead ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM inquiries WHERE id = @id");

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error: any) {
    console.error("Delete Customer Lead Error:", error);
    return NextResponse.json({ message: "Failed to delete lead" }, { status: 500 });
  }
}
