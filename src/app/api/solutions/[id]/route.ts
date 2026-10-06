import { NextResponse } from "next/server";
import { getDbConnection, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pool = await getDbConnection();
    
    const isNumeric = !isNaN(Number(params.id));
    const dbRequest = pool.request();
    
    let query = `
      SELECT 
        id, title, badge, description, slug, status, order_index, template_data,
        CASE 
          WHEN thumbnail_image IS NOT NULL AND LEN(thumbnail_image) > 500 THEN CONCAT('/api/solutions/', COALESCE(slug, CAST(id as varchar)), '/images/thumb')
          ELSE thumbnail_image
        END as thumbnail_image,
        CASE 
          WHEN detail_image_1 IS NOT NULL AND LEN(detail_image_1) > 500 THEN CONCAT('/api/solutions/', COALESCE(slug, CAST(id as varchar)), '/images/detail1')
          ELSE detail_image_1
        END as detail_image_1,
        CASE 
          WHEN detail_image_2 IS NOT NULL AND LEN(detail_image_2) > 500 THEN CONCAT('/api/solutions/', COALESCE(slug, CAST(id as varchar)), '/images/detail2')
          ELSE detail_image_2
        END as detail_image_2
      FROM Solutions WHERE `;
    
    if (isNumeric) {
       // Support fetching by order_index (e.g., "01", "02") or by exact ID
       query += '(order_index = @NumId OR id = @NumId)';
       dbRequest.input('NumId', parseInt(params.id));
    } else {
       query += 'slug = @Slug'; 
       dbRequest.input('Slug', params.id);
    }

    const result = await dbRequest.query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: "Solution not found" }, { status: 404 });
    }

    const solution = result.recordset[0];
    const identifier = solution.slug || solution.id;

    // Parse template_data if it exists
    if (solution.template_data) {
      try {
        const td = typeof solution.template_data === "string" ? JSON.parse(solution.template_data) : solution.template_data;
        if (td.hero?.image && (td.hero.image.startsWith("data:") || td.hero.image.length > 500)) {
          td.hero.image = `/api/solutions/${identifier}/images/hero`;
        }
        if (td.features_section?.cards && Array.isArray(td.features_section.cards)) {
          td.features_section.cards.forEach((card: any, idx: number) => {
            if (card.image && (card.image.startsWith("data:") || card.image.length > 500)) {
              card.image = `/api/solutions/${identifier}/images/card${idx}`;
            }
          });
        }
        solution.template_data = td;
      } catch (e) {
        console.error("Failed to parse template_data JSON");
      }
    }

    if (solution.thumbnail_image && (solution.thumbnail_image.startsWith("data:") || solution.thumbnail_image.length > 500)) {
      solution.thumbnail_image = `/api/solutions/${identifier}/images/thumb`;
    }
    if (solution.detail_image_1 && (solution.detail_image_1.startsWith("data:") || solution.detail_image_1.length > 500)) {
      solution.detail_image_1 = `/api/solutions/${identifier}/images/detail1`;
    }
    if (solution.detail_image_2 && (solution.detail_image_2.startsWith("data:") || solution.detail_image_2.length > 500)) {
      solution.detail_image_2 = `/api/solutions/${identifier}/images/detail2`;
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
    const isNumeric = !isNaN(Number(params.id));
    const requestPool = pool.request();
    requestPool.input('TemplateData', JSON.stringify(template_data));

    if (isNumeric) {
      requestPool.input('NumId', parseInt(params.id));
      await requestPool.query(`
        UPDATE Solutions 
        SET template_data = @TemplateData, updated_at = GETDATE()
        WHERE id = @NumId OR order_index = @NumId
      `);
    } else {
      requestPool.input('Slug', params.id);
      await requestPool.query(`
        UPDATE Solutions 
        SET template_data = @TemplateData, updated_at = GETDATE()
        WHERE slug = @Slug
      `);
    }
      
    return NextResponse.json({ message: "Solution template updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update solution", error: error.message }, { status: 500 });
  }
}
