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
       // Support exact ID first, fallback to order_index only if exact ID not found
       query += '(id = @NumId OR order_index = @NumId) ORDER BY CASE WHEN id = @NumId THEN 0 ELSE 1 END';
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

import { invalidateRequestCache } from "@/lib/request-cache";
import { revalidatePath } from "next/cache";

async function persistBase64Image(pool: any, rawData: string, prefix: string): Promise<string> {
  if (!rawData || !rawData.startsWith("data:")) return rawData;
  const filename = `${Date.now()}-${prefix}.png`;
  const relativePath = `uploads/${filename}`;
  await pool.request()
    .input("Title", relativePath)
    .input("Data", rawData)
    .query(`INSERT INTO dbo.Images (title, image_data, created_at) VALUES (@Title, @Data, GETDATE())`);
  return `/api/images/${relativePath}`;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { template_data, thumbnail_image } = data;
    
    if (!template_data) {
      return NextResponse.json({ message: "template_data is required" }, { status: 400 });
    }

    const pool = await getDbConnection();
    const isNumeric = !isNaN(Number(params.id));
    let existingSlug = "";
    let existingId: number | null = null;

    // Preserve existing image data if incoming payload contains proxy image URLs
    let existingDetail1: string | null = null;
    let existingDetail2: string | null = null;
    let existingThumbnail: string | null = null;

    
    try {
      const checkReq = pool.request();
      let queryExisting = `SELECT id, slug, template_data, detail_image_1, detail_image_2, thumbnail_image FROM Solutions WHERE `;
      if (isNumeric) {
        queryExisting += "(id = @NumId OR order_index = @NumId) ORDER BY CASE WHEN id = @NumId THEN 0 ELSE 1 END";
        checkReq.input("NumId", parseInt(params.id));
      } else {
        queryExisting += "slug = @Slug";
        checkReq.input("Slug", params.id);
      }
      const existingRes = await checkReq.query(queryExisting);
      if (existingRes.recordset.length > 0) {
        const row = existingRes.recordset[0];
        existingSlug = row.slug || "";
        existingId = row.id || null;
        existingDetail1 = row.detail_image_1 || null;
        existingDetail2 = row.detail_image_2 || null;
        existingThumbnail = row.thumbnail_image || null;

        if (row.template_data) {
          const oldTd = typeof row.template_data === "string"
            ? JSON.parse(row.template_data)
            : row.template_data;

          if (template_data.hero?.image && template_data.hero.image.includes("/images/hero")) {
            template_data.hero.image = oldTd.hero?.image || existingThumbnail || template_data.hero.image;
          }

          if (template_data.features_section?.cards && Array.isArray(template_data.features_section.cards)) {
            template_data.features_section.cards.forEach((card: any, idx: number) => {
              if (card.image && card.image.includes(`/images/card${idx}`)) {
                card.image = oldTd.features_section?.cards?.[idx]?.image 
                  || (idx === 0 ? existingDetail1 : idx === 1 ? existingDetail2 : null)
                  || card.image;
              }
            });
          }
        }
      }
    } catch (preserveErr) {
      console.warn("Could not preserve existing template_data images:", preserveErr);
    }

    // Auto-persist any base64 images directly into dbo.Images so they are in the DB
    if (template_data.hero?.image && template_data.hero.image.startsWith("data:")) {
      template_data.hero.image = await persistBase64Image(pool, template_data.hero.image, "hero");
    }
    if (template_data.hero?.logo_image && template_data.hero.logo_image.startsWith("data:")) {
      template_data.hero.logo_image = await persistBase64Image(pool, template_data.hero.logo_image, "logo");
    }
    if (template_data.features_section?.cards && Array.isArray(template_data.features_section.cards)) {
      for (let idx = 0; idx < template_data.features_section.cards.length; idx++) {
        const card = template_data.features_section.cards[idx];
        if (card.image && card.image.startsWith("data:")) {
          card.image = await persistBase64Image(pool, card.image, `card${idx}`);
        }
      }
    }

    const card0 = template_data.features_section?.cards?.[0]?.image;
    const card1 = template_data.features_section?.cards?.[1]?.image;

    // Determine values for detail_image_1 and detail_image_2 in dbo.Solutions
    let finalDetail1: string | null = null;
    let updateD1 = 1;
    if (card0) {
      if (card0.includes('/images/card0') || card0.includes('/images/detail1')) {
        updateD1 = 0; // retain existing
      } else {
        finalDetail1 = card0;
      }
    } else {
      finalDetail1 = null; // explicitly cleared
    }

    let finalDetail2: string | null = null;
    let updateD2 = 1;
    if (card1) {
      if (card1.includes('/images/card1') || card1.includes('/images/detail2')) {
        updateD2 = 0; // retain existing
      } else {
        finalDetail2 = card1;
      }
    } else {
      finalDetail2 = null; // explicitly cleared
    }

    const heroImg = template_data.hero?.image;
    let finalThumb: string | null = null;
    let updateThumb = 0;

    if (thumbnail_image !== undefined && thumbnail_image !== null) {
      finalThumb = thumbnail_image;
      if (typeof finalThumb === "string" && finalThumb.startsWith("data:")) {
        finalThumb = await persistBase64Image(pool, finalThumb, "thumb");
      }
      updateThumb = 1;
    } else if (template_data.thumbnail_image !== undefined && template_data.thumbnail_image !== null) {
      finalThumb = template_data.thumbnail_image;
      if (typeof finalThumb === "string" && finalThumb.startsWith("data:")) {
        finalThumb = await persistBase64Image(pool, finalThumb, "thumb");
      }
      updateThumb = 1;
    } else if (heroImg && !heroImg.includes('/images/hero') && !heroImg.includes('/images/thumb')) {
      finalThumb = heroImg;
      updateThumb = 1;
    }

    const requestPool = pool.request();
    requestPool.input('TemplateData', JSON.stringify(template_data));
    requestPool.input('Detail1', finalDetail1);
    requestPool.input('UpdateD1', updateD1);
    requestPool.input('Detail2', finalDetail2);
    requestPool.input('UpdateD2', updateD2);
    requestPool.input('Thumb', finalThumb);
    requestPool.input('UpdateThumb', updateThumb);

    const updateQuery = `
      UPDATE Solutions 
      SET template_data = @TemplateData,
          detail_image_1 = CASE WHEN @UpdateD1 = 1 THEN @Detail1 ELSE detail_image_1 END,
          detail_image_2 = CASE WHEN @UpdateD2 = 1 THEN @Detail2 ELSE detail_image_2 END,
          thumbnail_image = CASE WHEN @UpdateThumb = 1 THEN @Thumb ELSE thumbnail_image END,
          updated_at = GETDATE()
      WHERE `;

    if (isNumeric) {
      const targetId = existingId || parseInt(params.id);
      requestPool.input('TargetId', targetId);
      await requestPool.query(`${updateQuery} id = @TargetId`);
    } else {
      requestPool.input('Slug', params.id);
      await requestPool.query(`${updateQuery} slug = @Slug`);
    }

    // Invalidate request cache and Next.js paths
    invalidateRequestCache("solutions-page-list");
    invalidateRequestCache(`solution-detail-${params.id}`);
    if (existingSlug) invalidateRequestCache(`solution-detail-${existingSlug}`);
    if (existingId) invalidateRequestCache(`solution-detail-${existingId}`);

    try {
      revalidatePath('/solutions');
      revalidatePath(`/solutions/${params.id}`);
      if (existingSlug) revalidatePath(`/solutions/${existingSlug}`);
      revalidatePath('/');
    } catch {}
      
    return NextResponse.json({ message: "Solution template updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update solution", error: error.message }, { status: 500 });
  }
}
