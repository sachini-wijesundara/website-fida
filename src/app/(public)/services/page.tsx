import PageHero from "@/components/shared/page-hero";
import ServicesClient from "./services-client";

export const metadata = {
  title: "Services | FIDA Global",
  description: "Explore FIDA Global's full suite of IT services — from infrastructure to cybersecurity and managed operations.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="What We Do"
        badgeColor="blue"
        accent="blue"
        title={<>Full-Spectrum <span style={{ color: "var(--blue)" }} className="italic">IT Services</span><br />Built to Scale</>}
        subtitle="From day-one strategy through ongoing managed operations, FIDA covers the entire IT lifecycle so you never have to stitch together multiple vendors."
      />
      <ServicesClient />
    </main>
  );
}
