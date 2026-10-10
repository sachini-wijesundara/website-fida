import SolutionsClient from "./solutions-client";
import { getDbConnection } from "@/lib/db";
import { cachedRequest } from "@/lib/request-cache";

export const metadata = {
  title: "Business Software Solutions | FIDA Global",
  description: "Browse FIDA Global's full range of business solutions — Smart HRIS, payroll, CRM, task management, helpdesk, and AI-powered tools for growing companies.",
  keywords: "business software solutions Sri Lanka, enterprise IT solutions, ICT solutions provider, HR and workforce management software, Best IT solution provider",
};

export const dynamic = "force-dynamic";

export default async function SolutionsPage() {
  let initialSolutions: any[] = [];
  try {
    const result = await cachedRequest("solutions-page-list", async () => {
      const pool = await getDbConnection();
      return pool.request().query(`
        SELECT 
          id, title, badge, description, slug, status, order_index,
          CASE 
            WHEN thumbnail_image IS NOT NULL AND LEN(thumbnail_image) > 500 THEN CONCAT('/api/solutions/', id, '/images/thumb')
            ELSE thumbnail_image
          END as thumbnail_image
        FROM Solutions 
        WHERE status = 'Active' OR status IS NULL
        ORDER BY ISNULL(order_index, 9999) ASC, id ASC
      `);
    }, 60_000);
    initialSolutions = JSON.parse(JSON.stringify(result.recordset || []));
  } catch (e) {
    console.error("Failed to fetch solutions for page:", e);
  }

  return (
    <main className="min-h-screen pt-24 pb-32 bg-[#f8fafc]">
      <SolutionsClient initialSolutions={initialSolutions} />
    </main>
  );
}
