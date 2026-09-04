export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { invalidateRequestCache } from "@/lib/request-cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = Number.parseInt(params.id, 10);
    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 });
    }

    const pool = await getDbConnection();
    const result = await pool.request()
      .input("ProjectId", projectId)
      .query(`
        SELECT p.id, p.title, p.client_name, p.category_id, p.description,
               p.image_url, p.status, p.created_at, p.updated_at,
               c.name AS category_name
        FROM dbo.projects p
        LEFT JOIN dbo.categories c ON c.id = p.category_id
        WHERE p.id = @ProjectId
          AND (p.status <> 'Deleted' OR p.status IS NULL);
      `);
    const project = result.recordset[0];
    
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    
    const formattedProject = {
      ...project,
      Title: project.title,
      Description: project.description,
      ImageUrl: project.image_url,
      ClientName: project.client_name,
      CategoryName: project.category_name,
      ProjectId: project.id,
    };
    
    return NextResponse.json(formattedProject);
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ message: "Failed to fetch project", error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    const { title, clientName, categoryId, description, imageUrl, status } = data;
    const projectId = Number.parseInt(id, 10);
    const parsedCategoryId = Number.parseInt(String(categoryId), 10);

    if (!Number.isInteger(projectId) || !Number.isInteger(parsedCategoryId) || !title || !description) {
      return NextResponse.json(
        { message: "Project title, category, and description are required." },
        { status: 400 },
      );
    }

    const pool = await getDbConnection();
    const result = await pool.request()
      .input('ProjectId', projectId)
      .input('Title', title)
      .input('ClientName', clientName || null)
      .input('CategoryId', parsedCategoryId)
      .input('Description', description)
      .input('ImageUrl', imageUrl || null)
      .input('Status', status || 'Published')
      .query(`
        UPDATE dbo.projects
        SET title = @Title,
            client_name = @ClientName,
            category_id = @CategoryId,
            description = @Description,
            image_url = @ImageUrl,
            status = @Status,
            updated_at = GETDATE()
        WHERE id = @ProjectId;
      `);

    if (result.rowsAffected[0] !== 1) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    invalidateRequestCache("all-projects");
    invalidateRequestCache("project-summaries");
    invalidateRequestCache("public-projects-list");

    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Failed to update project", error: error.message }, { status: 500 });
  }
}
