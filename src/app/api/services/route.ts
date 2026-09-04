export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetServices');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch services", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, title, description, imageUrl, iconName, label, features, orderIndex, status } = data;
    const pool = await getDbConnection();

    await pool.request()
      .input('id', sql.Int, id || null)
      .input('title', sql.NVarChar(255), title)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('image_url', sql.NVarChar(sql.MAX), imageUrl)
      .input('icon_name', sql.NVarChar(100), iconName)
      .input('label', sql.NVarChar(100), label)
      .input('features', sql.NVarChar(sql.MAX), features) // Stored as JSON string or comma-separated
      .input('order_index', sql.Int, orderIndex || 0)
      .input('status', sql.NVarChar(50), status || 'Published')
      .execute('sp_UpsertService');

    return NextResponse.json({ message: "Service saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to save service", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE services SET status = 'Deleted' WHERE id = @id`);

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete service", error: error.message }, { status: 500 });
  }
}
