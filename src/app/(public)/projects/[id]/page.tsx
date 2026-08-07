"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const PROJECT_DATA: Record<string, any> = {
  "monaro": {
    title: "MONARO",
    category: "Smart HRIS",
    image: "/images/client_project_images/monaro.png",
    description1: "The Monaro digital transformation represents a benchmark in modern enterprise HR management. By migrating a fragmented legacy infrastructure into a unified Smart HRIS environment, FIDA Global streamlined complex payroll architectures and performance tracking mechanisms for an organization of over 1,300 professionals.",
    description2: "This initiative focused on eradicating manual synchronization bottlenecks that previously led to a 12% error margin in cross-border payroll processing. Through rigorous process re-engineering and the deployment of our proprietary automation layer, Monaro achieved a seamless operational flow that scales dynamically with their aggressive growth trajectory.",
    challenge: "Monaro faced extreme operational friction due to decentralized data silos. Managers were spending approximately 15 hours weekly on manual data entry, while payroll disputes were increasing month-over-month, threatening employee morale and corporate compliance.",
    solution: "We implemented a custom Smart HRIS core integrated with real-time biometric tracking and automated compliance audits. Our team deployed a phased migration strategy, ensuring zero downtime for critical payroll cycles while training internal stakeholders on the new digital-first ecosystem.",
    result: "Beyond the primary metrics, Monaro reported a 45% increase in HR department efficiency. Employee satisfaction scores related to administrative transparency rose by 60%, and the organization successfully expanded into two new international territories using the scalable framework provided."
  }
};

const MORE_STUDIES = [
  {
    id: 1,
    title: "Agro Momentum",
    category: "Agri Business",
    description: "Optimizing supply chain logistics for the southern hemisphere's largest grain exporter.",
    image: "/images/client_project_images/agromomentum.png"
  },
  {
    id: 2,
    title: "Commercial Insurance Brokers",
    category: "Fintech",
    description: "Digitizing claims processing with advanced AI-driven risk assessment models.",
    image: "/images/client_project_images/commercial.png"
  },
  {
    id: 3,
    title: "ACL",
    category: "Logistics",
    description: "Building a global distribution network for real-time fleet synchronization.",
    image: "/images/client_project_images/aclcables.png"
  }
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  
  // Use Monaro data as fallback for now if ID is not specifically handled, just to ensure perfect visual match
  const data = PROJECT_DATA[id as string] || PROJECT_DATA["monaro"];

  useEffect(() => {
     window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#fafcff]">
      <section className="container mx-auto px-6 pt-32 pb-[350px] max-w-6xl">
        
        {/* Back Link */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#052c65] font-semibold text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#e0f2fe] text-[#0284c7]">
                {data.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#94a3b8]" />
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                Case Study
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-[#052c65] uppercase tracking-tighter mb-10 leading-tight">
              {data.title}
            </h1>

            <div className="space-y-6 text-[0.95rem] text-[#475569] leading-relaxed">
              <p>{data.description1}</p>
              <p>{data.description2}</p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#052c65]/5">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Challenge / Solution / Result */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Challenge</h3>
            <p className="text-[#64748b] text-[0.85rem] leading-relaxed">
              {data.challenge}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Solution</h3>
            <p className="text-[#64748b] text-[0.85rem] leading-relaxed">
              {data.solution}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Result</h3>
            <p className="text-[#64748b] text-[0.85rem] leading-relaxed">
              {data.result}
            </p>
          </div>
        </div>

        {/* More Case Studies */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-10">More Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MORE_STUDIES.map(study => (
              <Link href={`/projects/${study.id}`} key={study.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(5,44,101,0.03)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)] transition-all cursor-pointer">
                <div className="h-48 overflow-hidden bg-gray-100 p-2">
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-2">
                    {study.category}
                  </div>
                  <h3 className="text-base font-extrabold text-[#0f172a] mb-3">
                    {study.title}
                  </h3>
                  <p className="text-[#64748b] text-xs leading-relaxed line-clamp-3">
                    {study.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
