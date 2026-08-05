import PageHero from "@/components/shared/page-hero";
import CareersClient from "./careers-client";

export const metadata = {
  title: "Careers | FIDA Global",
  description: "Join FIDA Global — build the future of enterprise technology alongside 500+ engineers across 12 countries.",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="Join the Team"
        badgeColor="green"
        accent="green"
        title={<>Build the <span style={{ color: "var(--green)" }} className="italic">Future</span><br />of Enterprise IT</>}
        subtitle="We're a team of engineers, strategists, and problem-solvers united by one goal: making technology work better for businesses worldwide."
      />
      <CareersClient />
    </main>
  );
}
