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
    const result = await cachedRequest("all-projects", async () => {
      const pool = await getDbConnection();
      return pool.request().execute('sp_GetAllProjects');
    });

    initialProjects = result.recordset.map((p: any) => ({
      ...p,
      id: p.ProjectId || p.id || p.Id,
      title: p.title || p.Title,
      description: p.description || p.Description,
      image_url: p.image_url || p.ImageUrl,
      category_name: p.category_name || p.CategoryName,
      client_name: p.client_name || p.ClientName
    })).filter((project: any) => 
      project.status?.trim().toLowerCase() === "published" || 
      project.Status?.trim().toLowerCase() === "published"
    );
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
