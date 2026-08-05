"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, Briefcase } from "lucide-react";

export default function ProjectsSection() {
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
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen public-themed-section flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={30} />
      </section>
    );
  }

  return (
    <section className="py-24 public-themed-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
            >
              <div className="w-8 h-[1px] bg-blue-500" />
              Portfolio
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
              Selected <span className="text-[#167fa8] italic">Work</span>
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] text-sm max-w-xs font-medium border-l border-[#052c65]/10 pl-6 hidden lg:block">
            Exploring our latest success stories across 12 countries.
          </p>
        </div>
      </div>

      {/* Horizontal List */}
      <div className="relative group">
        <div className="flex gap-8 overflow-x-auto pb-20 pt-10 px-[10vw] no-scrollbar snap-x snap-mandatory scroll-smooth">
          {projects.map((project, index) => (
            <div key={project.id} className="snap-center">
              <ProjectCard project={project} index={index} />
            </div>
          ))}

          {/* View All Card */}
          <Link
            href="/projects"
            className="snap-center shrink-0 w-[80vw] md:w-[35vw] aspect-[4/3] rounded-[2.5rem] public-card flex flex-col items-center justify-center gap-6 group/all transition-all hover:-translate-y-1 hover:border-[#43bfd5]/50"
          >
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/all:scale-110 group-hover/all:bg-blue-600 group-hover/all:text-white transition-all duration-500 shadow-2xl shadow-blue-500/20">
              <ArrowUpRight size={36} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">View Projects</h3>
              <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest mt-2">Browse All Case Studies</p>
            </div>
          </Link>
        </div>

        {/* Side Gradients */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#f7fcfd] to-transparent z-10 hidden md:block" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#f7fcfd] to-transparent z-10 hidden md:block" />
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => router.push(`/projects/${project.id}`)}
      className="shrink-0 w-[85vw] md:w-[45vw] lg:w-[28vw] flex flex-col group cursor-pointer snap-center"
    >
      {/* Image */}
      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#edf8fa] mb-6 border border-[#052c65]/10 group-hover:border-[#43bfd5]/50 shadow-[0_18px_45px_rgba(5,44,101,.1)] transition-all duration-500">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-[#edf8fa] flex items-center justify-center text-[#9bb3c4]">
            <Briefcase size={40} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-start justify-between px-2">
        <div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
            {project.category_name || "Enterprise"}
          </p>
          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[#167fa8] transition-colors">
            {project.title}
          </h3>
        </div>
        <div className="h-10 w-10 shrink-0 rounded-full border border-[#052c65]/12 flex items-center justify-center text-[#052c65] group-hover:text-white group-hover:bg-[#052c65] group-hover:border-[#052c65] transition-all">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </motion.div>
  );
}
