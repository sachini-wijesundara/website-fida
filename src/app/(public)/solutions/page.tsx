import dynamic from "next/dynamic";

const SolutionsClient = dynamic(() => import("./solutions-client"), { ssr: false });

export const metadata = {
  title: "Business Software Solutions | FIDA Global",
  description: "Browse FIDA Global's full range of business solutions — Smart HRIS, payroll, CRM, task management, helpdesk, and AI-powered tools for growing companies.",
  keywords: "business software solutions Sri Lanka, enterprise IT solutions, ICT solutions provider, HR and workforce management software, Best IT solution provider",
};

export default function SolutionsPage() {
  return (
    <main className="min-h-screen pt-24 pb-32 bg-[#f8fafc]">
      <SolutionsClient />
    </main>
  );
}
