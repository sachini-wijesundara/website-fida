import PageHero from "@/components/shared/page-hero";
import SolutionsClient from "./solutions-client";

export const metadata = {
  title: "Solutions | FIDA Global",
  description: "Discover FIDA Global's purpose-built solutions — from HR automation to cloud security platforms.",
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="Our Products"
        badgeColor="green"
        accent="green"
        title={<>Smart <span style={{ color: "var(--green)" }} className="italic">Solutions</span><br />for Real Problems</>}
        subtitle="Purpose-built platforms and integrated solutions addressing the real operational challenges of modern enterprises."
      />
      <SolutionsClient />
    </main>
  );
}
