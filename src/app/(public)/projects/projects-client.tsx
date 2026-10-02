"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

function getDescription(description: string | undefined) {
  if (!description) return "";
  try {
    const parsed = JSON.parse(description);
    return parsed.main || description;
  } catch {
    return description;
  }
}

export default function ProjectsClient({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [projects] = useState<any[]>(initialProjects);

  return (
    <section className="container mx-auto px-6 pb-48 md:pb-56">
      {/* =====================================================================
          PROJECT CARDS GRID
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-24 px-2 md:px-0">
        {projects.map((proj, i) => (
          <Link key={proj.id} href={`/projects/${proj.id}`} className="block h-full group">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(5,44,101,0.04)] border border-[#052c65]/5 transition-all flex flex-col h-full cursor-pointer p-5 md:p-6 group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(5,44,101,0.08)]"
            >
              {/* Card Image */}
              <div className="relative h-48 md:h-52 w-full rounded-2xl overflow-hidden mb-5">
                <img 
                  src={proj.image_url} 
                  alt={proj.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Card Content & Metadata */}
              <div className="space-y-3 flex flex-col flex-1">
                {/* Project Title */}
                <h3 className="text-lg md:text-[1.3rem] font-bold text-[#052c65] leading-snug">
                  {proj.title}
                </h3>

                {/* Shortened Project Description */}
                <p className="text-[#64748b] text-xs md:text-sm leading-relaxed line-clamp-3 flex-1">
                  {getDescription(proj.description)}
                </p>

                {/* Card Footer Link */}
                <div className="pt-4 mt-auto">
                  <div className="border-t border-gray-100 mb-4"></div>
                  <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#3b82f6] group-hover:text-[#2563eb] transition-colors">
                    Project Detail <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* =====================================================================
          GLOBAL STATISTICS SECTION
          ===================================================================== */}
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
