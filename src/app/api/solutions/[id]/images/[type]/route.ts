import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

function parseDataUri(rawUrl: string): { mimeType: string; buffer: Buffer } | null {
  try {
    const commaIdx = rawUrl.indexOf(",");
    if (commaIdx === -1) return null;
    const header = rawUrl.substring(0, commaIdx);
    const mimeMatch = header.match(/data:([^;]+)/i);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
    const base64Data = rawUrl.substring(commaIdx + 1).replace(/\s/g, "");
    const buffer = Buffer.from(base64Data, "base64");
    return { mimeType, buffer };
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { id, type } = params;
    const pool = await getDbConnection();
    const isNumeric = !isNaN(Number(id));
    const req = pool.request();

    let selectCols = "template_data, detail_image_1, detail_image_2, thumbnail_image";

    let query = `SELECT id, slug, ${selectCols} FROM Solutions WHERE `;
    if (isNumeric) {
      query += "(id = @NumId OR order_index = @NumId) ORDER BY CASE WHEN id = @NumId THEN 0 ELSE 1 END";
      req.input("NumId", parseInt(id));
    } else {
      query += "slug = @Slug";
      req.input("Slug", id);
    }

    const result = await req.query(query);
    if (!result.recordset || result.recordset.length === 0) {
      return new NextResponse(null, { status: 404 });
    }

    const row = result.recordset[0];
    let rawImage: string | null = null;

    if (type === "thumb") {
      rawImage = row.thumbnail_image;
    } else if (type === "detail1") {
      rawImage = row.detail_image_1;
    } else if (type === "detail2") {
      rawImage = row.detail_image_2;
    } else if (row.template_data) {
      try {
        const td = JSON.parse(row.template_data);
        if (type === "hero") {
          rawImage = td.hero?.image;
          if (!rawImage || rawImage.includes(`/images/hero`)) {
            rawImage = row.thumbnail_image || row.detail_image_1;
          }
        } else if (type.startsWith("card")) {
          const cardIdx = parseInt(type.replace("card", "")) || 0;
          rawImage = td.features_section?.cards?.[cardIdx]?.image;
          if (!rawImage || rawImage.includes(`/images/${type}`) || rawImage.includes(`/images/card${cardIdx}`)) {
            if (cardIdx === 0 && row.detail_image_1) {
              rawImage = row.detail_image_1;
            } else if (cardIdx === 1 && row.detail_image_2) {
              rawImage = row.detail_image_2;
            } else {
              rawImage = null;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing template_data for image extraction:", e);
      }
    }

    // Fallbacks if image is missing or self-referential
    const isSmartHris = row.slug === "smart-hris" || id === "smart-hris" || id === "14";
    if (!rawImage || rawImage.includes(`/images/${type}`) || rawImage === request.url) {
      if (type === "hero") {
        rawImage = row.thumbnail_image || row.detail_image_1;
      } else if (type === "card0" && row.detail_image_1) {
        rawImage = row.detail_image_1;
      } else if (type === "card1" && row.detail_image_2) {
        rawImage = row.detail_image_2;
      } else if (isSmartHris) {
        if (type === "card0") rawImage = "/api/images/solutions_images/smarthrispic1.png";
        else if (type === "card1") rawImage = "/api/images/solutions_images/smarthrispic2.png";
      }
    }

    if (!rawImage) {
      return new NextResponse(null, { status: 404 });
    }

    if (!rawImage.startsWith("data:")) {
      const targetUrl = new URL(rawImage, request.url);
      if (targetUrl.pathname === new URL(request.url).pathname) {
        // Prevent infinite redirect loops
        if (type === "hero") {
          rawImage = row.thumbnail_image || row.detail_image_1;
        } else if (type === "card0" && row.detail_image_1) {
          rawImage = row.detail_image_1;
        } else if (type === "card1" && row.detail_image_2) {
          rawImage = row.detail_image_2;
        } else if (isSmartHris && type === "card0") {
          return NextResponse.redirect(new URL("/api/images/solutions_images/smarthrispic1.png", request.url));
        } else if (isSmartHris && type === "card1") {
          return NextResponse.redirect(new URL("/api/images/solutions_images/smarthrispic2.png", request.url));
        } else {
          return new NextResponse(null, { status: 404 });
        }

        if (!rawImage || rawImage.includes(`/images/${type}`)) {
          return new NextResponse(null, { status: 404 });
        }
        if (!rawImage.startsWith("data:")) {
          return NextResponse.redirect(new URL(rawImage, request.url));
        }
      } else {
        return NextResponse.redirect(targetUrl);
      }
    }

    const parsed = parseDataUri(rawImage);
    if (!parsed || parsed.buffer.length === 0) {
      return new NextResponse(null, { status: 500 });
    }

    return new NextResponse(new Uint8Array(parsed.buffer), {
      status: 200,
      headers: {
        "Content-Type": parsed.mimeType,
        "Content-Length": parsed.buffer.length.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: any) {
    console.error("Solution image route error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
