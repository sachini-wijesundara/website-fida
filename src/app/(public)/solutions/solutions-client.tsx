"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const CATEGORIES = ["All", "Software Solutions", "Consultancy & Services"];

export default function SolutionsClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const res = await fetch("/api/solutions");
        const data = await res.json();
        setSolutions(data);
      } catch (err) {
        console.error("Failed to fetch solutions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#052c65]">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        ) : Array.isArray(solutions) ? (
          solutions.map((sol, index) => {
             const displayNumber = (sol.order_index || index + 1).toString().padStart(2, "0");
            
            // Check if it matches category filter (basic implementation)
            if (activeCategory !== "All" && sol.badge !== "CONSULTANCY" && activeCategory === "Consultancy & Services") return null;
            if (activeCategory !== "All" && sol.badge === "CONSULTANCY" && activeCategory === "Software Solutions") return null;

            return (
              <Link href={`/solutions/${displayNumber}`} key={sol.id} className="block group">
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
                        <img src={sol.thumbnail_image || sol.detail_image_1 || "/placeholder.jpg"} alt={sol.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                     </div>
                  </div>

                  {/* Content Column */}
                  <div className="w-full md:w-7/12 flex flex-col justify-center">
                     <div className="text-6xl font-black text-[#a5f3fc] leading-none mb-4 tracking-tighter">
                       {displayNumber}
                     </div>
                     
                     <div className="mb-4">
                        <span className="px-3 py-1 bg-[#e0f2fe] text-[#0284c7] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                          {sol.badge || "SOLUTION"}
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
            );
          })
        ) : (
          <div className="flex justify-center items-center py-20 text-red-500 font-bold">
            Failed to load solutions. Data is not an array. Please try refreshing the page.
          </div>
        )}
      </div>
    </div>
  );
}
