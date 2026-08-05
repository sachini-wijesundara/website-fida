import Hero from "@/components/home/hero";
import HomeOverview from "@/components/home/home-overview";
import ProductsSection from "@/components/home/products-section";
import ExpertiseSection from "@/components/home/expertise-section";
import MarvelousItems from "@/components/home/marvelous-items";
import ProjectsSection from "@/components/home/projects-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import BlogSection from "@/components/home/blog-section";
import CtaSection from "@/components/home/cta-section";

export default function Home() {
  return (
    <main className="home-page min-h-screen font-sans">
      <Hero />
      <HomeOverview />
      <ProductsSection />
      <ExpertiseSection />
      <MarvelousItems />
      <ProjectsSection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
    </main>
  );
}
