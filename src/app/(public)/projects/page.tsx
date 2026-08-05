import PageHero from "@/components/shared/page-hero";
import ProjectsClient from "./projects-client";

export const metadata = {
  title: "Projects | FIDA Global",
  description: "Browse FIDA Global's portfolio of custom implementations and specialized software projects.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="Portfolio Archive"
        badgeColor="green"
        accent="green"
        title={<>Precision <span style={{ color: "var(--green)" }} className="italic">Projects</span><br />for Global Clients</>}
        subtitle="Exploring our history of bespoke development, consulting, and custom technical implementations."
      />
      <ProjectsClient />
    </main>
  );
}
