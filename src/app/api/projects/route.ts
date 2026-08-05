import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().execute('sp_GetAllProjects');
    
    // Normalize field names to handle naming inconsistencies from DB
    const projects = result.recordset.map((p: any) => ({
      ...p,
      id: p.ProjectId || p.id || p.Id,
      ProjectId: p.ProjectId || p.id || p.Id,
      title: p.title || p.Title,
      description: p.description || p.Description,
      image_url: p.image_url || p.ImageUrl,
      category_name: p.category_name || p.CategoryName,
      client_name: p.client_name || p.ClientName
    }));

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch projects", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, clientName, categoryId, description, imageUrl, status } = data;
    
    if (!title || !categoryId) {
      console.error("Missing required fields:", { title, categoryId });
      return NextResponse.json({ message: "Title and Category are required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    
    const result = await pool.request()
      .input('Title', sql.NVarChar(255), title)
      .input('ClientName', sql.NVarChar(100), clientName)
      .input('CategoryId', sql.Int, categoryId)
      .input('Description', sql.NVarChar(sql.MAX), description)
      .input('ImageUrl', sql.NVarChar(sql.MAX), imageUrl)
      .input('Status', sql.NVarChar(20), status || 'Published')
      .execute('sp_CreateProject');


    if (!result.recordset || result.recordset.length === 0) {
       console.error("No recordset returned from sp_CreateProject");
       return NextResponse.json({ message: "Failed to retrieve new project ID" }, { status: 500 });
    }

    return NextResponse.json({ message: "Project created", projectId: result.recordset[0].ProjectId });
  } catch (error: any) {
    console.error("POST /api/projects Error:", error);
    return NextResponse.json({ message: "Failed to create project", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('ProjectId', sql.Int, id)
      .execute('sp_DeleteProject');

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete project", error: error.message }, { status: 500 });
  }
}
