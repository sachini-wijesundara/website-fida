"use client";

// Core animation and navigation imports
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// ============================================================================
// 1. LOOKUP CONFIGURATION & HELPER FUNCTIONS
// ============================================================================

/**
 * Hardcoded lookup table mapping specific project IDs to their
 * display category and industry / client domain.
 * This is used to classify projects client-side without extra database columns.
 */
const PROJECT_DISPLAY: Record<number, { category: string; client: string }> = {
  1011: { category: "Task Manager", client: "Hospitality & Tourism" },
  1014: { category: "Access Control & Attendance", client: "Supply Chain" },
  1015: { category: "Access Control & Attendance", client: "Manufacturing" },
  1029: { category: "Business Consultancy", client: "ICT" },
  1030: { category: "Smart HRIS", client: "Financial Services" },
  1031: { category: "Smart HRIS", client: "Agribusiness & Logistics" },
  1032: { category: "Smart HRIS", client: "BPO" },
};

/**
 * Determines whether a project belongs to SMEs or Large Enterprises.
 * By default, project ID 1031 is classified as SME, and all others as Large Enterprise.
 */
function getProjectSize(project: any) {
  if (Number(project.id) === 1031) return "Small and Medium Enterprises";
  return "Large Enterprise";
}

/**
 * Resolves the industry label for a project.
 * Priority: PROJECT_DISPLAY lookup -> project.client_name -> fallback "ICT".
 */
function getProjectIndustry(project: any) {
  return PROJECT_DISPLAY[Number(project.id)]?.client || project.client_name || "ICT";
}

/**
 * Safely parses and extracts the readable project description.
 * If the description is a JSON string (e.g. `{ "main": "..." }`), it extracts the "main" text.
 */
function getDescription(description: string | undefined) {
  if (!description) return "";
  try {
    const parsed = JSON.parse(description);
    return parsed.main || description;
  } catch {
    return description;
  }
}

// ============================================================================
// 2. MAIN COMPONENT: ProjectsClient
// ============================================================================

/**
 * Client component that manages interactive filtering, featured project presentation,
 * and the responsive project showcase grid.
 *
 * @param initialProjects Pre-fetched published projects passed from the server component
 */
export default function ProjectsClient({ initialProjects = [] }: { initialProjects?: any[] }) {
  // --------------------------------------------------------------------------
  // Component State
  // --------------------------------------------------------------------------
  // Currently selected Enterprise Size filter ("All Sizes", "Small and Medium Enterprises", etc.)
  const [activeSize, setActiveSize] = useState("All Sizes");

  // Currently selected Industry filter ("All Industries", "Financial Services", etc.)
  const [activeIndustry, setActiveIndustry] = useState("All Industries");

  // Project catalog list initialized from server props
  const [projects, setProjects] = useState<any[]>(initialProjects);

  // Toggle state for expanding/collapsing the featured project description on mobile screens
  const [isFeaturedExpanded, setIsFeaturedExpanded] = useState(false);

  // --------------------------------------------------------------------------
  // Featured Project Selection
  // --------------------------------------------------------------------------
  // Pin project ID 1032 as the featured showcase item; fallback to first project if not present
  const featuredProject = projects.find((project) => Number(project.id) === 1032) || projects[0];
  
  // Available filter options
  const sizes = ["All Sizes", "Small and Medium Enterprises", "Large Enterprise"];
  const industries = [
    "All Industries",
    "Agribusiness & Logistics",
    "Financial Services",
    "Manufacturing",
    "Hospitality & Tourism",
    "ICT",
    "BPO"
  ];

  // --------------------------------------------------------------------------
  // Client-Side Filtration Logic (useMemo)
  // --------------------------------------------------------------------------
  // Filters the grid in memory without making extra API or database calls
  const gridProjects = useMemo(() => {
    return projects
      // 1. Exclude the featured project so it doesn't appear twice (banner + grid)
      .filter((project) => project.id !== featuredProject?.id)
      // 2. Filter by Enterprise Size (skip if "All Sizes")
      .filter((project) => activeSize === "All Sizes" || getProjectSize(project) === activeSize)
      // 3. Filter by Industry (skip if "All Industries")
      .filter((project) => activeIndustry === "All Industries" || getProjectIndustry(project) === activeIndustry);
  }, [activeSize, activeIndustry, featuredProject?.id, projects]);

  return (
    <section className="container mx-auto px-6 pb-48 md:pb-56">
      {/* =====================================================================
          FEATURED PROJECT HERO BANNER
          ===================================================================== */}
      {featuredProject && (
        <motion.div 
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-[#052c65]/5 overflow-hidden mb-16 flex flex-col lg:flex-row max-w-6xl mx-auto"
        >
          {/* Featured Image */}
          <div className="lg:w-3/5 h-64 lg:h-auto">
             <img 
               src={featuredProject.image_url} 
               alt={featuredProject.title} 
               className="w-full h-full object-cover" 
               loading="lazy" 
             />
          </div>

          {/* Featured Details & Content */}
          <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center bg-white relative">
             {/* Category Badges */}
             <div className="flex gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#3b82f6] text-white">
                  FEATURED
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#e0f2fe] text-[#0284c7]">
                  SMART HRIS
                </span>
             </div>

             {/* Featured Title */}
             <h2 className="text-4xl font-extrabold text-[#052c65] uppercase tracking-tight mb-4">
               {featuredProject.title}
             </h2>

             {/* Featured Description with mobile clamp toggle */}
             <div className="mb-6 relative">
               <p className={`text-[#64748b] leading-relaxed ${!isFeaturedExpanded ? "line-clamp-4 md:line-clamp-none" : ""}`}>
                 {getDescription(featuredProject.description)}
               </p>
               <button 
                 onClick={() => setIsFeaturedExpanded(!isFeaturedExpanded)}
                 className="text-[#3b82f6] font-bold text-[13px] mt-2 md:hidden hover:text-[#2563eb] transition-colors"
               >
                 {isFeaturedExpanded ? "Show Less" : "Read More"}
               </button>
             </div>

             <div className="flex items-center gap-2 text-[#0284c7] font-semibold text-sm mb-8">
             </div>

             {/* Link to Dedicated Case Study Page */}
             <div>
                <Link 
                  href={`/projects/${featuredProject.id}`} 
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors inline-flex items-center gap-2"
                >
                   View Case Study <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </motion.div>
      )}

      {/* =====================================================================
          FILTER CONTROLS SECTION
          ===================================================================== */}
      <div className="flex flex-col gap-4 mb-16 max-w-5xl mx-auto">
        {/* Mobile Dropdowns: compact select inputs visible only on screens smaller than md */}
        <div className="grid grid-cols-2 gap-3 px-4 md:hidden pb-6">
          {/* Mobile Enterprise Size Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[#052c65] uppercase tracking-wider pl-1 whitespace-nowrap overflow-hidden text-ellipsis">
              Enterprise Size
            </label>
            <div className="relative group">
              <select 
                value={activeSize}
                onChange={(e) => setActiveSize(e.target.value)}
                className="w-full p-3 pr-8 rounded-xl border border-[#e2e8f0] bg-white/90 backdrop-blur-sm text-xs font-bold text-[#334155] outline-none focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 shadow-[0_8px_24px_rgba(5,44,101,0.04)] appearance-none transition-all cursor-pointer hover:border-[#cbd5e1] hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)]"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none transition-colors group-hover:text-[#3b82f6]" />
            </div>
          </div>

          {/* Mobile Industry Wise Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[#052c65] uppercase tracking-wider pl-1 whitespace-nowrap overflow-hidden text-ellipsis">
              Industry Wise
            </label>
            <div className="relative group">
              <select 
                value={activeIndustry}
                onChange={(e) => setActiveIndustry(e.target.value)}
                className="w-full p-3 pr-8 rounded-xl border border-[#e2e8f0] bg-white/90 backdrop-blur-sm text-xs font-bold text-[#334155] outline-none focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 shadow-[0_8px_24px_rgba(5,44,101,0.04)] appearance-none transition-all cursor-pointer hover:border-[#cbd5e1] hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)]"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none transition-colors group-hover:text-[#3b82f6]" />
            </div>
          </div>
        </div>

        {/* Desktop Enterprise Size Filter Pills (hidden on mobile, visible on md and up) */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center w-full">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setActiveSize(size)}
              className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-colors border leading-tight flex items-center justify-center text-center ${
                activeSize === size 
                  ? "bg-[#3b82f6] border-[#3b82f6] text-white" 
                  : "bg-white border-gray-200 text-[#64748b] hover:border-[#3b82f6]/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Desktop Industry Filter Pills (hidden on mobile, visible on md and up) */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center w-full pb-4">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-colors border leading-tight flex items-center justify-center text-center ${
                activeIndustry === ind 
                  ? "bg-[#3b82f6] border-[#3b82f6] text-white" 
                  : "bg-white border-gray-200 text-[#64748b] hover:border-[#3b82f6]/50"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          FILTERED PROJECT CARDS GRID
          ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto mb-24 px-2 md:px-0">
        {gridProjects.map((proj, i) => (
          <Link key={proj.id} href={`/projects/${proj.id}`} className="block h-full group">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[1.25rem] md:rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(5,44,101,0.04)] border border-[#052c65]/5 transition-all flex flex-col h-full cursor-pointer group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(5,44,101,0.08)]"
            >
              {/* Card Image */}
              <div className="relative h-32 md:h-56 overflow-hidden">
                 <img 
                   src={proj.image_url} 
                   alt={proj.title} 
                   loading="lazy"
                   decoding="async"
                   className="w-full h-full object-cover" 
                 />
              </div>

              {/* Card Content & Metadata */}
              <div className="p-4 md:p-8 space-y-1.5 md:space-y-3 flex flex-col flex-1">
                 {/* Project Title */}
                 <h3 className="text-[13px] md:text-[1.35rem] font-bold text-[#0f172a] leading-tight line-clamp-2 md:line-clamp-none">
                   {proj.title}
                 </h3>

                 {/* Industry & Enterprise Size Subtitle */}
                 <div className="text-[9px] md:text-sm text-[#64748b]">
                    {getProjectIndustry(proj)} • {getProjectSize(proj)}
                 </div>

                 {/* Shortened Project Description */}
                 <p className="text-[#334155] text-[10px] md:text-[0.95rem] leading-relaxed line-clamp-2 flex-1 mt-2 md:mt-4">
                    {getDescription(proj.description)}
                 </p>

                 {/* Card Footer Link */}
                 <div className="pt-3 md:pt-6 mt-auto">
                    <div className="border-t border-gray-200 mb-3 md:mb-6"></div>
                    <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-sm font-semibold text-[#3b82f6]">
                       Project Detail <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
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
