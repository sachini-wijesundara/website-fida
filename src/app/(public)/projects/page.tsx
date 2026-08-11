import ProjectsClient from "./projects-client";

export const metadata = {
  title: "Projects | FIDA Global",
  description: "Browse FIDA Global's portfolio of custom implementations and specialized software projects.",
};

export default function ProjectsPage() {
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
      <ProjectsClient />
    </main>
  );
}
