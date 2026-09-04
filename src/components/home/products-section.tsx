"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Loader2, Check } from "lucide-react";

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const activeProducts = data.filter((p: any) => p.status === "Active");
          setProducts(activeProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [products]);

  if (loading) {
    return (
      <section className="min-h-[60vh] public-themed-section flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const getHighlights = (product: any) => {
    if (!product?.highlights) {
      if (product?.title?.toLowerCase().includes("task")) {
        return ["Task tracking", "Collaboration", "Time logging", "Sprint boards"];
      }
      if (product?.title?.toLowerCase().includes("helpdesk")) {
        return ["Ticket management", "SLA tracking", "Knowledge base", "Customer portal"];
      }
      return ["Enterprise scale", "High reliability", "Seamless API", "Cloud secure"];
    }
    try {
      const parsed = JSON.parse(product.highlights);
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch {
      return product.highlights.split(",").map((item: any) => item.trim()).filter(Boolean).slice(0, 4);
    }
  };

  const activeProduct = products[activeIndex];

  return (
    <section className="py-24 public-themed-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%]     rounded-full" style={{ background: "radial-gradient(circle, var(--tw-gradient-stops, rgba(56, 189, 248, 0.15)), transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%]     rounded-full" style={{ background: "radial-gradient(circle, var(--tw-gradient-stops, rgba(56, 189, 248, 0.15)), transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
            >
              <div className="w-8 h-[1px] bg-blue-500" />
              Ecosystem Suite
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
              Our <span className="text-[#167fa8] italic">Solutions</span>
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] text-sm max-w-xs font-medium border-l border-[#052c65]/10 pl-6 hidden lg:block">
            Standardized platforms designed for rapid deployment and maximum enterprise impact.
          </p>
        </div>

        {/* Showcase split layout */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Product Information */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            {/* Tabs for switching products */}
            <div className="flex flex-wrap gap-2.5">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-[#052c65] text-white shadow-[0_12px_24px_-8px_rgba(5,44,101,0.4)] scale-105"
                      : "bg-[#edf8fa] text-[#052c65] hover:bg-[#dff8fb] hover:scale-102"
                  }`}
                >
                  {product.title.split("-")[0].trim()}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      {activeProduct.tag || "Enterprise"}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight">
                    {activeProduct.title}
                  </h3>
                  {activeProduct.subtitle && (
                    <p className="text-primary/70 text-xs font-bold uppercase tracking-widest">
                      {activeProduct.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-[var(--text-secondary)] text-base leading-relaxed font-medium">
                  {activeProduct.description}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
                  {getHighlights(activeProduct).map((item: string) => (
                    <span key={item} className="flex items-center gap-2 text-xs font-bold text-[#536b8a]">
                      <Check size={14} className="text-green-500 shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                <div className="pt-6">
                  <Link
                    href={activeProduct.website_url || "/contact"}
                    className="inline-flex items-center gap-3 bg-[#052c65] text-white px-10 py-4.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:bg-[#167fa8] hover:scale-105 shadow-[0_18px_36px_-14px_rgba(5,44,101,.35)]"
                  >
                    Learn More <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: overlapping mockup stage */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="smart-hris-product-stage w-full !mt-0 relative"
              >
                {/* Laptop mockup */}
                <div className="smart-hris-dashboard-shot">
                  <img
                    src={activeProduct.image_url || "/api/images/homepageimages/image5.png"}
                    alt={`${activeProduct.title} Dashboard`}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Mobile mockup */}
                <div className="smart-hris-mobile-shot">
                  <img
                    src="/api/images/homepageimages/IMG_8542.PNG"
                    alt={`${activeProduct.title} Mobile App`}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Connecting SVG paths */}
                <svg className="smart-hris-connector" viewBox="0 0 1000 540" aria-hidden="true">
                  <path d="M80 470 C170 470 150 390 240 390 M795 240 C880 240 850 330 950 330" />
                </svg>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
