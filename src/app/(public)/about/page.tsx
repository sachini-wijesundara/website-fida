import AboutClient from "./about-client";

export const metadata = {
  title: "About Us | FIDA Global",
  description: "Learn about FIDA Global's mission, values, and the team driving digital transformation worldwide.",
};

export default function AboutPage() {
  return (
    <main className="public-pastel-page min-h-screen">
      <AboutClient />
    </main>
  );
}
