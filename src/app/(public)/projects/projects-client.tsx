"use client";

import { motion } from "framer-motion";
import { ExternalLink, Briefcase, Calendar, User } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ProjectsClient() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.filter((p: any) => p.status === "Published"));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
       <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
       </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.ProjectId || proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group public-card rounded-[2rem] overflow-hidden hover:border-[#43bfd5]/50 transition-all flex flex-col h-full cursor-pointer hover:-translate-y-1"
            onClick={() => window.location.href = `/projects/${proj.ProjectId || proj.id}`}
          >
            <div className="relative aspect-video overflow-hidden">
               <img 
                 src={proj.image_url || proj.ImageUrl} 
                 alt={proj.title || proj.Title} 
                 className="w-full h-full object-cover transition-smooth group-hover:scale-110 grayscale group-hover:grayscale-0" 
               />
               <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white shadow-lg">
                    {proj.category_name || proj.CategoryName}
                  </span>
               </div>
            </div>

            <div className="p-8 space-y-6 flex flex-col flex-1">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter group-hover:text-[#167fa8] transition-colors">
                    {proj.title || proj.Title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                     <div className="flex items-center gap-1.5"><User size={12} /> {proj.client_name || proj.ClientName || "Enterprise"}</div>
                  </div>
               </div>

               <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">
                  {proj.description || proj.Description}
               </p>

               <div className="pt-6 border-t border-[#052c65]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                     <Briefcase size={12} /> Project Detail
                  </div>
                  <div className="w-10 h-10 rounded-full border border-[#052c65]/12 flex items-center justify-center group-hover:bg-[#052c65] group-hover:border-[#052c65] text-[#052c65] group-hover:text-white transition-all">
                     <ExternalLink size={18} />
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
