import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllSolutions');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch solutions", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, title, description, iconName, orderIndex, status } = data;
    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('Id', sql.Int, id || null)
      .input('Title', sql.NVarChar(255), title)
      .input('Description', sql.NVarChar(500), description)
      .input('IconName', sql.NVarChar(50), iconName)
      .input('OrderIndex', sql.Int, orderIndex || 0)
      .input('Status', sql.NVarChar(20), status || 'Active')
      .execute('sp_UpsertSolution');

    return NextResponse.json({ 
      message: id ? "Solution updated" : "Solution created", 
      solutionId: result.recordset[0].SolutionId 
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Operation failed", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Solution ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_DeleteSolution');

    return NextResponse.json({ message: "Solution deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete solution", error: error.message }, { status: 500 });
  }
}
