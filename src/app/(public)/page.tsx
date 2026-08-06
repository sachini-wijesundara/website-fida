import Hero from "@/components/home/hero";
import HomeOverview from "@/components/home/home-overview";

export default function Home() {
  return (
    <main className="home-page min-h-screen font-sans">
      <Hero />
      <HomeOverview />
    </main>
  );
}
