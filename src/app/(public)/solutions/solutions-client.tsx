"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Rocket } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SolutionsClient() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.filter((p: any) => p.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="pb-32 public-themed-section">
      <section className="container mx-auto px-6 space-y-16">
        <div className="flex flex-col gap-4 border-l-4 border-blue-500 pl-8">
           <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
              <Rocket size={14} /> Ecosystem Suite
           </span>
           <h2 className="text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Our Products</h2>
           <p className="text-[var(--text-muted)] max-w-2xl font-medium">Standardized platforms and integrated technical frameworks designed for rapid deployment and enterprise-wide efficiency.</p>
        </div>

        <div className="space-y-12">
          {products.map((sol, i) => (
            <SolutionCard key={sol.id} item={sol} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SolutionCard({ item, index }: any) {
  const href = item.website_url || "/contact";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="public-card rounded-[2.5rem] overflow-hidden relative transition-smooth hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(5,44,101,.13)]"
    >
      <div className="p-10 lg:p-14 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="w-full aspect-square rounded-3xl overflow-hidden border border-[#052c65]/10 shadow-xl relative group bg-[#edf8fa]">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-smooth group-hover:scale-110" />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 text-blue-400 bg-blue-500/5">
              {item.tag || 'Platform'}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] leading-none tracking-tighter uppercase">{item.title}</h2>
          </div>
          
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl font-medium">{item.description}</p>
          
          <div className="pt-6">
            <Link
              href={item.website_url || "/contact"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black text-xs uppercase bg-[#052c65] text-white transition-all hover:bg-[#167fa8] hover:scale-105 shadow-[0_18px_36px_-14px_rgba(5,44,101,.35)]"
            >
              Launch Project <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
