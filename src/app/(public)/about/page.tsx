import PageHero from "@/components/shared/page-hero";
import AboutClient from "./about-client";

export const metadata = {
  title: "About Us | FIDA Global",
  description: "Learn about FIDA Global's mission, values, and the team driving digital transformation worldwide.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="Who We Are"
        title={<>Building <span style={{ color: "var(--green)" }} className="italic">Tomorrow's</span><br />Enterprise Today</>}
        subtitle="FIDA Global is an award-winning technology company delivering intelligent IT infrastructure, cybersecurity, and managed services to enterprises across 12 countries."
        accent="green"
      />
      <AboutClient />
    </main>
  );
}

