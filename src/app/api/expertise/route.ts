export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllExpertise');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch expertise", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, icon, orderIndex, status } = data;
    const pool = await getDbConnection();

    const result = await pool.request()
      .input('Title', sql.NVarChar(255), title)
      .input('Description', sql.NVarChar(sql.MAX), description)
      .input('Icon', sql.NVarChar(50), icon)
      .input('OrderIndex', sql.Int, orderIndex || 0)
      .input('Status', sql.NVarChar(20), status || 'Published')
      .execute('sp_CreateExpertise');

    return NextResponse.json({ message: "Expertise created", expertiseId: result.recordset[0].ExpertiseId });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create expertise", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Expertise ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ExpertiseId', sql.Int, id)
      .execute('sp_DeleteExpertise');

    return NextResponse.json({ message: "Expertise deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete expertise", error: error.message }, { status: 500 });
  }
}
