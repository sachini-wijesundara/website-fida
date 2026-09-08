import AboutClient from "./about-client";

export const metadata = {
  title: "About FIDA Global | IT & HR Technology Company",
  description: "Learn about FIDA Global's history, mission, and leadership team — a Sri Lankan tech company delivering HRIS, consultancy, and software since 2011.",
  keywords: "FIDA Global company, about FIDA Global, IT company Sri Lanka, HR technology company, Innovation, Best IT solution provider",
};

export default function AboutPage() {
  return (
    <main className="public-pastel-page min-h-screen">
      <AboutClient />
    </main>
  );
}
