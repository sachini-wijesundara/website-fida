"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import React, { useState } from "react";

const CATEGORIES = [
  "All",
  "Smart HRIS",
  "Access Control & Attendance",
  "Business Consultancy",
  "Task Manager",
  "Helpdesk System",
];

const PROJECTS = [
  {
    id: 1,
    title: "Agro Momentum",
    client: "Agri-business & Logistics",
    category: "Smart HRIS",
    description: "Integrated payroll and workforce management for large-scale agricultural...",
    image: "/images/client_project_images/agromomentum.png"
  },
  {
    id: 2,
    title: "Commercial Insurance Brokers",
    client: "Financial Services",
    category: "Smart HRIS",
    description: "Optimized performance tracking and leave management for elite financial...",
    image: "/images/client_project_images/commercial.png"
  },
  {
    id: 3,
    title: "ACL Cables",
    client: "Manufacturing",
    category: "Access Control",
    description: "Enterprise-wide biometric access control and synchronized real-time...",
    image: "/images/client_project_images/aclcables.png"
  },
  {
    id: 4,
    title: "ABANS ENVIRONMENTAL SERVICES (PVT) LTD",
    client: "Hospitality & Tourism",
    category: "Task Manager",
    description: "Internal workflow automation and client booking task management solution.",
    image: "/images/client_project_images/abans.png"
  },
  {
    id: 5,
    title: "Rotax Limited",
    client: "Corporate Strategy",
    category: "Consultancy",
    description: "Strategic business process re-engineering and executive advisory...",
    image: "/images/client_project_images/rotax.png"
  },
  {
    id: 6,
    title: "LRDC SERVICES",
    client: "Supply Chain",
    category: "Access Control",
    description: "Secure perimeter access control integrated with automated fleet driver...",
    image: "/images/client_project_images/lrdc.png"
  }
];

export default function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section className="container mx-auto px-6 pb-48 md:pb-56">
      {/* Featured Project */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-sm border border-[#052c65]/5 overflow-hidden mb-16 flex flex-col lg:flex-row max-w-6xl mx-auto"
      >
        <div className="lg:w-3/5 h-64 lg:h-auto">
           <img src="/images/client_project_images/monaro.png" alt="Featured Project" className="w-full h-full object-cover" />
        </div>
        <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center bg-white relative">
           <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#3b82f6] text-white">
                FEATURED
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#e0f2fe] text-[#0284c7]">
                SMART HRIS
              </span>
           </div>
           <h2 className="text-4xl font-extrabold text-[#052c65] uppercase tracking-tight mb-4">
             MONARO
           </h2>
           <p className="text-[#64748b] leading-relaxed mb-6">
             A full-scale digital transformation of human resource management, streamlining payroll, attendance, and performance tracking for a high-growth enterprise.
           </p>
           <div className="flex items-center gap-2 text-[#0284c7] font-semibold text-sm mb-8">
              <Users size={16} />
              1,240 employees managed
           </div>
           <div>
              <Link href="/projects/monaro" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors inline-flex items-center gap-2">
                 View Case Study <ArrowRight size={16} />
              </Link>
           </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-colors border ${
              activeCategory === cat 
                ? "bg-[#3b82f6] border-[#3b82f6] text-white" 
                : "bg-white border-gray-200 text-[#64748b] hover:border-[#3b82f6]/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
        {PROJECTS.map((proj, i) => (
          <Link key={proj.id} href={`/projects/${proj.id}`} className="block h-full group">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(5,44,101,0.04)] border border-[#052c65]/5 transition-all flex flex-col h-full cursor-pointer group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(5,44,101,0.08)]"
          >
            <div className="relative h-56 overflow-hidden">
               <img 
                 src={proj.image} 
                 alt={proj.title} 
                 className="w-full h-full object-cover" 
               />
               <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#e6f2f0] text-[#1e293b] shadow-sm">
                    {proj.category}
                  </span>
               </div>
            </div>

            <div className="p-8 space-y-3 flex flex-col flex-1">
               <h3 className="text-[1.35rem] font-bold text-[#0f172a] leading-tight">
                 {proj.title}
               </h3>
               <div className="text-sm text-[#64748b]">
                  {proj.client}
               </div>

               <p className="text-[#334155] text-[0.95rem] leading-relaxed line-clamp-3 flex-1 mt-4">
                  {proj.description}
               </p>

               <div className="pt-6 mt-4">
                  <div className="border-t border-gray-200 mb-6"></div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6]">
                     Project Detail <ArrowRight size={16} />
                  </div>
               </div>
            </div>
          </motion.div>
          </Link>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-[#052c65] rounded-[2rem] p-8 text-center flex flex-col justify-center items-center h-48">
            <div className="text-5xl font-black text-white mb-2">370+</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">CLIENTS GLOBALLY</div>
         </div>
         <div className="bg-[#56c6d9] rounded-[2rem] p-8 text-center flex flex-col justify-center items-center h-48">
            <div className="text-5xl font-black text-[#052c65] mb-2">4</div>
            <div className="text-[10px] font-bold text-[#052c65]/70 uppercase tracking-widest">COUNTRIES</div>
         </div>
         <div className="bg-[#052c65] rounded-[2rem] p-8 text-center flex flex-col justify-center items-center h-48">
            <div className="text-5xl font-black text-white mb-2">14+</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">YEARS EXP.</div>
         </div>
         <div className="bg-[#f1f5f9] rounded-[2rem] p-8 text-center flex flex-col justify-center items-center h-48">
            <div className="text-5xl font-black text-[#052c65] mb-2">50K+</div>
            <div className="text-[10px] font-bold text-[#052c65]/70 uppercase tracking-widest">PAYROLL EMPLOYEES</div>
         </div>
      </div>
    </section>
  );
}
