import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cachedRequest, invalidateRequestCache } from "@/lib/request-cache";

export async function GET(request: Request) {
  try {
    const summary = new URL(request.url).searchParams.get("summary") === "true";
    if (summary) {
      const projects = await cachedRequest("project-summaries", async () => {
        const pool = await getDbConnection();
        const result = await pool.request().query(`
          SELECT
            p.id,
            p.title,
            p.client_name,
            p.category_id,
            c.name AS category_name,
            p.status,
            p.created_at,
            p.updated_at,
            CASE
              WHEN p.image_url LIKE 'data:%' THEN CONCAT('/api/projects/', p.id, '/image')
              ELSE p.image_url
            END AS image_url
          FROM projects p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.status <> 'Deleted' OR p.status IS NULL
          ORDER BY p.created_at DESC
        `);
        return result.recordset;
      });
      return NextResponse.json(projects);
    }

    const result = await cachedRequest("all-projects", async () => {
      const pool = await getDbConnection();
      return pool.request().execute('sp_GetAllProjects');
    });
    
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
      .input('Title', title)
      .input('ClientName', clientName || null)
      .input('CategoryId', Number(categoryId))
      .input('Description', description || null)
      .input('ImageUrl', imageUrl || null)
      .input('Status', status || 'Published')
      .execute('sp_CreateProject');

    invalidateRequestCache("all-projects");
    invalidateRequestCache("project-summaries");


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
      .input('ProjectId', Number(id))
      .execute('sp_DeleteProject');

    invalidateRequestCache("all-projects");
    invalidateRequestCache("project-summaries");

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete project", error: error.message }, { status: 500 });
  }
}
