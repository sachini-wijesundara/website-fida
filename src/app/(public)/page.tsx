import Hero from "@/components/home/hero";
import HomeOverview from "@/components/home/home-overview";
import SolutionsContent from "@/components/home/solutions-content";
import TestimonialsSection from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <main className="home-page min-h-screen font-sans">
      <Hero />
      <div className="unified-background-wrapper">
        <HomeOverview />
        <SolutionsContent />
      </div>
      <TestimonialsSection />
    </main>
  );
}
