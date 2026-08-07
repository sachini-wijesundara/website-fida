import PageHero from "@/components/shared/page-hero";
import SolutionsClient from "./solutions-client";

export const metadata = {
  title: "Solutions | FIDA Global",
  description: "Discover FIDA Global's purpose-built solutions — from HR automation to cloud security platforms.",
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#e0f7fa] to-transparent opacity-60 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[1000px] h-[1000px] bg-gradient-to-tl from-[#e0f7fa] to-transparent opacity-40 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#e0f7fa] to-transparent opacity-50 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 pt-32 pb-[350px]">
        <SolutionsClient />
      </div>
    </main>
  );
}
