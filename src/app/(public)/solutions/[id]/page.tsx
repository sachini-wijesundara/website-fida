import React from "react";
import SolutionDetailClient from "./solution-detail-client";
import { getDbConnection } from "@/lib/db";
import { cachedRequest } from "@/lib/request-cache";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const UPPERCASE_WORDS = new Set(["crm", "hris", "fida", "hrms", "erp", "ai", "hr"]);
  const formattedTitle = (id || "solution")
    .split("-")
    .map((w) => UPPERCASE_WORDS.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | FIDA Global`,
    description: `Discover how ${formattedTitle} by FIDA Global elevates enterprise efficiency and performance.`
  };
}

export default async function SolutionPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let initialData: any = null;

  try {
    initialData = await cachedRequest(`solution-detail-${id}`, async () => {
      const pool = await getDbConnection();
      const isNumeric = !isNaN(Number(id));
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
        query += "(order_index = @NumId OR id = @NumId)";
        dbRequest.input("NumId", parseInt(id));
      } else {
        query += "slug = @Slug";
        dbRequest.input("Slug", id);
      }

      const result = await dbRequest.query(query);
      if (result.recordset.length === 0) return null;

      const solution = result.recordset[0];
      const identifier = solution.slug || solution.id;

      let td: any = {};
      if (solution.template_data) {
        try {
          td = typeof solution.template_data === "string" 
            ? JSON.parse(solution.template_data) 
            : solution.template_data;

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
        } catch (e) {
          console.error("Failed to parse template_data JSON");
        }
      }

      let thumb = solution.thumbnail_image;
      if (thumb && (thumb.startsWith("data:") || thumb.length > 500)) {
        thumb = `/api/solutions/${identifier}/images/thumb`;
      }

      let detail1 = solution.detail_image_1;
      if (detail1 && (detail1.startsWith("data:") || detail1.length > 500)) {
        detail1 = `/api/solutions/${identifier}/images/detail1`;
      }

      return {
        ...td,
        order_index: solution.order_index,

        
        slug: solution.slug,
        thumbnail_image: thumb,
        detail_image_1: detail1
      };
    }, 60_000);
  } catch (err) {
    console.error("SSR fetch error for solution detail:", err);
  }

  return <SolutionDetailClient id={id} initialData={initialData} />;
}
