import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pool = await getDbConnection();
    
    const isNumeric = !isNaN(Number(params.id));
    const request = pool.request();
    
    let query = 'SELECT * FROM Solutions WHERE ';
    
    if (isNumeric) {
       // Support fetching by order_index (e.g., "01", "02") or by exact ID
       query += '(order_index = @NumId OR id = @NumId)';
       request.input('NumId', parseInt(params.id));
    } else {
       query += 'slug = @Slug'; 
       request.input('Slug', params.id);
    }

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: "Solution not found" }, { status: 404 });
    }

    const solution = result.recordset[0];
    // Parse template_data if it exists
    if (solution.template_data) {
      try {
        solution.template_data = JSON.parse(solution.template_data);
      } catch (e) {
        console.error("Failed to parse template_data JSON");
      }
    }

    return NextResponse.json(solution);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch solution", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { template_data } = data;
    
    if (!template_data) {
      return NextResponse.json({ message: "template_data is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('Id', parseInt(params.id))
      .input('TemplateData', JSON.stringify(template_data))
      .query(`
        UPDATE Solutions 
        SET template_data = @TemplateData, updated_at = GETDATE()
        WHERE id = @Id
      `);
      
    return NextResponse.json({ message: "Solution template updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update solution", error: error.message }, { status: 500 });
  }
}
