"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const CATEGORIES = ["All", "Software Solutions", "Consultancy & Services"];

const SOLUTIONS = [
  {
    id: "01",
    badge: "SOFTWARE SOLUTION",
    title: "SMART HRIS",
    description: "Centralize human resources, payroll, and performance management into a single automated ecosystem built for growth.",
    image: "/images/solutions_images/smarthris.png"
  },
  {
    id: "02",
    badge: "SOFTWARE SOLUTION",
    title: "FIDA TASK MANAGER",
    description: "Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.",
    image: "/images/solutions_images/taskmanager.png"
  },
  {
    id: "03",
    badge: "ACCESS CONTROL",
    title: "ACCESS CONTROL & ATTENDANCE",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    image: "/images/solutions_images/attendance.png"
  },
  {
    id: "04",
    badge: "SOFTWARE SOLUTION",
    title: "FIDA HELPDESK SYSTEM",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    image: "/images/solutions_images/helpdesk.png"
  },
  {
    id: "05",
    badge: "CONSULTANCY",
    title: "FIDA BUSINESS CONSULTANCY",
    description: "Strategic advisory and digital transformation expertise to scale your enterprise operations with precision and clarity.",
    image: "/images/solutions_images/bpo&services.png"
  }
];

export default function SolutionsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Header Section */}
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-black text-[#052c65] tracking-tight mb-8 text-center md:text-left">
          Smart Solutions for <span className="text-[#38bdf8]">Real</span> Problems
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <p className="text-[#64748b] text-sm max-w-md leading-relaxed">
            Precision-engineered tools designed to integrate seamlessly into your corporate infrastructure.
          </p>

          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === cat 
                    ? "bg-[#2563eb] border-[#2563eb] text-white shadow-md" 
                    : "bg-white border-gray-200 text-[#475569] hover:border-[#38bdf8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solutions List */}
      <div className="space-y-16">
        {SOLUTIONS.map((sol, index) => (
          <Link href={`/solutions/${sol.id}`} key={sol.id} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              {/* Image Column */}
              <div className="w-full md:w-5/12">
                 <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-gray-100">
                    <img src={sol.image} alt={sol.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                 </div>
              </div>

              {/* Content Column */}
              <div className="w-full md:w-7/12 flex flex-col justify-center">
                 <div className="text-6xl font-black text-[#a5f3fc] leading-none mb-4 tracking-tighter">
                   {sol.id}
                 </div>
                 
                 <div className="mb-4">
                    <span className="px-3 py-1 bg-[#e0f2fe] text-[#0284c7] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                      {sol.badge}
                    </span>
                 </div>

                 <h2 className="text-2xl font-black text-[#052c65] uppercase tracking-tight mb-4 group-hover:text-[#2563eb] transition-colors">
                   {sol.title}
                 </h2>

                 <p className="text-[#475569] text-sm leading-relaxed max-w-lg mb-8">
                   {sol.description}
                 </p>

                 <div>
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#052c65] text-white text-xs font-bold transition-colors group-hover:bg-[#167fa8]">
                       Learn More <ArrowRight size={14} />
                    </span>
                 </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
