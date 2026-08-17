import ProjectsClient from "./projects-client";
import { getDbConnection } from "@/lib/db";
import { cachedRequest } from "@/lib/request-cache";

export const metadata = {
  title: "Projects | FIDA Global",
  description: "Browse FIDA Global's portfolio of custom implementations and specialized software projects.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let initialProjects: any[] = [];
  try {
    const result = await cachedRequest("public-projects-list", async () => {
      const pool = await getDbConnection();
      return pool.request().query(`
        SELECT
          p.id,
          p.title,
          p.client_name,
          p.category_id,
          c.name AS category_name,
          p.description,
          p.status,
          p.created_at,
          p.updated_at,
          CASE
            WHEN p.image_url LIKE 'data:%' THEN CONCAT('/api/projects/', p.id, '/image')
            ELSE p.image_url
          END AS image_url
        FROM projects p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.status = 'Published'
        ORDER BY p.created_at DESC
      `);
    });

    initialProjects = result.recordset.map((p: any) => ({
      ...p,
      id: p.id || p.ProjectId || p.Id,
      title: p.title || p.Title,
      description: p.description || p.Description,
      image_url: p.image_url || p.ImageUrl,
      category_name: p.category_name || p.CategoryName,
      client_name: p.client_name || p.ClientName
    }));
    
    // Ensure serializability for Client Components
    initialProjects = JSON.parse(JSON.stringify(initialProjects));
  } catch (error) {
    console.error("Failed to fetch initial projects:", error);
  }

  return (
    <main className="public-pastel-page min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 text-center max-w-4xl mb-16">
        <h1 className="text-[#052c65] text-[clamp(2.5rem,4vw,3.5rem)] font-extrabold tracking-tight leading-tight mb-6">
          Precision Projects for <span className="text-[#38bdf8]">Global</span> Clients
        </h1>
        <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
          Exploring our history of bespoke deployment, consulting, and enterprise implementations across 4 countries.
        </p>
      </div>
      <ProjectsClient initialProjects={initialProjects} />
    </main>
  );
}
