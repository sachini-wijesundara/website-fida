import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT id, title, badge, description, thumbnail_image, slug, status, order_index FROM Solutions ORDER BY order_index ASC');
    return NextResponse.json(result.recordset);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch solutions", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, title, badge, description, thumbnail_image, orderIndex, status } = data;
    const pool = await getDbConnection();
    
    if (id) {
      await pool.request()
        .input('Id', id)
        .input('Title', title)
        .input('Badge', badge || null)
        .input('Description', description)
        .input('ThumbnailImage', thumbnail_image || null)
        .input('OrderIndex', orderIndex || 0)
        .input('Status', status || 'Active')
        .query(`
          UPDATE Solutions 
          SET title = @Title, badge = @Badge, description = @Description, 
              thumbnail_image = @ThumbnailImage, order_index = @OrderIndex, 
              status = @Status, updated_at = GETDATE()
          WHERE id = @Id
        `);
      return NextResponse.json({ message: "Solution updated", solutionId: id });
    } else {
      const defaultTemplateData = JSON.stringify({
        hero: { 
          title: "New Solution", 
          subtitle: "Tagline goes here", 
          description: "Describe the benefits and features of this solution.", 
          features: ["Feature 1", "Feature 2", "Feature 3"], 
          image: "/placeholder.jpg" 
        },
        features_section: { 
          title: "Built for Enterprise Efficiency", 
          cards: [
            { title: "Core Feature 1", description: "Details about this feature.", iconBg: "#3b82f6", iconText: "white" },
            { title: "Core Feature 2", description: "Details about this feature.", iconBg: "#10b981", iconText: "white" }
          ] 
        },
        stats: { 
          percentage: "100%", 
          title: "Improvement", 
          description: "Describe the metric.", 
          before_text: "Before: Manual process", 
          after_text: "After: Automated process" 
        }
      });

      const result = await pool.request()
        .input('Title', title)
        .input('Badge', badge || null)
        .input('Description', description)
        .input('ThumbnailImage', thumbnail_image || null)
        .input('OrderIndex', orderIndex || 0)
        .input('Status', status || 'Active')
        .input('TemplateData', defaultTemplateData)
        .query(`
          INSERT INTO Solutions (title, badge, description, thumbnail_image, order_index, status, template_data)
          OUTPUT INSERTED.id AS SolutionId
          VALUES (@Title, @Badge, @Description, @ThumbnailImage, @OrderIndex, @Status, @TemplateData)
        `);
      return NextResponse.json({ message: "Solution created", solutionId: result.recordset[0].SolutionId });
    }
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
      .input('Id', id)
      .query('DELETE FROM Solutions WHERE id = @Id');

    return NextResponse.json({ message: "Solution deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete solution", error: error.message }, { status: 500 });
  }
}
