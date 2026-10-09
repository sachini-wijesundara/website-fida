import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";
import { invalidateRequestCache } from "@/lib/request-cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT 
        id, title, badge, description, slug, status, order_index,
        CASE 
          WHEN thumbnail_image IS NOT NULL AND LEN(thumbnail_image) > 0 THEN CONCAT('/api/solutions/', id, '/images/thumb')
          ELSE ''
        END as thumbnail_image,
        CASE 
          WHEN detail_image_1 IS NOT NULL AND LEN(detail_image_1) > 0 THEN CONCAT('/api/solutions/', id, '/images/detail1')
          ELSE ''
        END as detail_image_1,
        JSON_VALUE(template_data, '$.hero.image') as hero_image
      FROM Solutions 
      ORDER BY ISNULL(order_index, 9999) ASC, id ASC
    `);
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
      invalidateRequestCache("solutions-page-list");
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
            { title: "Core Feature 2", description: "Details about this feature.", iconBg: "#10b981", iconText: "white" },
            { title: "Core Feature 3", description: "Details about this feature.", iconBg: "#f59e0b", iconText: "white" },
            { title: "Core Feature 4", description: "Details about this feature.", iconBg: "#ef4444", iconText: "white" }
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
        .input('Slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        .input('Badge', badge || null)
        .input('Description', description)
        .input('ThumbnailImage', thumbnail_image || null)
        .input('OrderIndex', orderIndex || 0)
        .input('Status', status || 'Active')
        .input('TemplateData', defaultTemplateData)
        .query(`
          INSERT INTO Solutions (title, slug, badge, description, thumbnail_image, order_index, status, template_data)
          OUTPUT INSERTED.id AS SolutionId
          VALUES (@Title, @Slug, @Badge, @Description, @ThumbnailImage, @OrderIndex, @Status, @TemplateData)
        `);
      invalidateRequestCache("solutions-page-list");
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

    invalidateRequestCache("solutions-page-list");
    return NextResponse.json({ message: "Solution deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete solution", error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (Array.isArray(orderedIds)) {
      const pool = await getDbConnection();
      for (let i = 0; i < orderedIds.length; i++) {
        await pool.request()
          .input('Id', parseInt(orderedIds[i]))
          .input('OrderIndex', i + 1)
          .query('UPDATE Solutions SET order_index = @OrderIndex, updated_at = GETDATE() WHERE id = @Id');
      }
      invalidateRequestCache("solutions-page-list");
      return NextResponse.json({ message: "Solutions order updated successfully" });
    }
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Reorder Solutions Error:", error);
    return NextResponse.json({ message: "Failed to reorder solutions", error: error.message }, { status: 500 });
  }
}
