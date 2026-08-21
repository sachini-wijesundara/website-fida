import SolutionsClient from "./solutions-client";

export const metadata = {
  title: "Solutions | FIDA Global",
  description:
    "Discover FIDA Global's purpose-built solutions — from HR automation to task management, access control, helpdesk, and strategic consultancy.",
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-[#f8fafc]">
      <SolutionsClient />
    </main>
  );
}
