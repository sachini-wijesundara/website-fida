import PageHero from "@/components/shared/page-hero";
import BlogClient from "./blog-client";

export const metadata = {
  title: "Blog | FIDA Global",
  description: "Insights, deep dives, and expert commentary from the FIDA Global technology team.",
};

export default function BlogPage() {
  return (
    <main className="public-pastel-page min-h-screen">
      <PageHero
        badge="Knowledge Base"
        badgeColor="grey"
        accent="blue"
        title={<>Insights from the <span style={{ color: "var(--blue)" }} className="italic">Front Lines</span><br />of Enterprise IT</>}
        subtitle="Expert analysis, practical guides, and lessons learned from FIDA's engineers working in the world's most demanding IT environments."
      />
      <BlogClient />
    </main>
  );
}
