"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Loader2,
  Briefcase,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import SpaceBackground from "@/components/animations/space-background";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          console.error("Failed to fetch project");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center text-[var(--text-primary)] space-y-6">
        <h2 className="text-3xl font-bold">Project Not Found</h2>
        <button
          onClick={() => router.push("/projects")}
          className="px-6 py-2 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition-all"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#dff8fb] via-white/50 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[#167fa8] transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Portfolio</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {project.CategoryName || "Enterprise"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                  Case Study
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                {project.Title || project.title}
              </h1>

              <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl">
                {(project.Description || project.description)?.split('\n')[0] || "Revolutionizing industry standards through intelligent technical implementation and strategic consulting."}
              </p>

              <div className="flex flex-wrap gap-8 py-8 border-y border-[#052c65]/10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Client</p>
                  <p className="text-blue-400 font-bold flex items-center gap-2">
                    <User size={16} />
                    {project.ClientName || project.client_name || "Confidential"}
                  </p>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-[#052c65]/10 shadow-[0_28px_70px_rgba(5,44,101,.14)]"
            >
              {(project.ImageUrl || project.image_url) ? (
                <img
                  src={project.ImageUrl || project.image_url}
                  alt={project.Title || project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#edf8fa] flex items-center justify-center text-[#a9bdca]">
                  <Briefcase size={80} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052c65]/25 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}


    </main>
  );
}
