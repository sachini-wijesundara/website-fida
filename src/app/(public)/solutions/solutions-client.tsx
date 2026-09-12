"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

const CATEGORIES = ["All", "Software Solutions", "Consultancy & Services"];

function GlobeImage() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 50%, #e8f6fc 0%, #c8eaf5 60%, #a8d8ee 100%)',
    }}>
      {/* Scrolling map for globe rotation effect */}
      <motion.div
        animate={{ x: [0, -600] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '8%',
          left: 0,
          width: '200%',
          height: '84%',
          display: 'flex',
        }}
      >
        {/* Render map twice for seamless loop */}
        <img src="/world-map.svg" alt="" style={{ width: '50%', height: '100%', objectFit: 'cover', opacity: 0.55, filter: 'hue-rotate(10deg) saturate(1.2)' }} loading="lazy" />
        <img src="/world-map.svg" alt="" style={{ width: '50%', height: '100%', objectFit: 'cover', opacity: 0.55, filter: 'hue-rotate(10deg) saturate(1.2)' }} loading="lazy" />
      </motion.div>

      {/* Sphere glass overlay — top highlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 38% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 35%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Sphere edge darkening */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        boxShadow: 'inset 0 0 60px 20px rgba(5,44,101,0.12)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function FullPageLoader({ isLoaded, onComplete }: { isLoaded: boolean, onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (isLoaded) {
      setProgress(100);
      const timeout = setTimeout(() => {
        onComplete();
      }, 400); 
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev; 
        return prev + Math.random() * 25;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isLoaded, onComplete]);

  const pct = Math.min(Math.round(progress), 100);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #f0f8ff 0%, #e8f5fd 40%, #d6f0f7 70%, #c8edf7 100%)' }}
    >
      {/* Ambient blurred color washes */}
      <div style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
        width: '50vw', height: '50vw', left: '-18vw', top: '5%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none',
        width: '55vw', height: '55vw', right: '-20vw', bottom: '-10%',
        background: 'radial-gradient(circle, rgba(5,44,101,0.12) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        width: '30vw', height: '30vw', left: '60%', top: '10%',
        background: 'radial-gradient(circle, rgba(97,213,229,0.14) 0%, transparent 70%)'
      }} />

      {/* Center stack */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ gap: '0' }}>

        {/* Globe with pulse rings */}
        <div style={{ position: 'relative', width: 'clamp(280px, 44vw, 380px)', aspectRatio: '1' }}>
          {/* Pulse rings */}
          {[1, 1.18, 1.36].map((scale, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1.5px solid rgba(56,189,248,0.22)',
                scale,
                transformOrigin: 'center',
              }}
              animate={{ scale: [scale, scale * 1.06, scale], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
            />
          ))}

          {/* Globe canvas wrapper */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 42% 34%, rgba(255,255,255,0.6), rgba(240,252,255,0.2) 60%, transparent 80%)',
            boxShadow: '0 20px 60px rgba(5,44,101,0.1), 0 4px 16px rgba(56,189,248,0.12)',
            position: 'relative',
          }}>
            <GlobeImage />
          </div>
        </div>

        {/* Animated loading label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginTop: '2rem', textAlign: 'center' }}
        >
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(5,44,101,0.6)',
            marginBottom: '0.5rem',
          }}>
            Loading Solutions{''.padEnd(dotCount, '.')}
          </div>

          {/* Progress bar */}
          <div style={{ width: 'clamp(200px, 32vw, 280px)', margin: '0 auto' }}>
            <div style={{
              height: '3px',
              background: 'rgba(5,44,101,0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '0.55rem',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: 'inherit',
                  background: 'linear-gradient(90deg, #052c65 0%, #0ea5e9 60%, #62d7e5 100%)',
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
            </div>
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'rgba(5,44,101,0.45)',
              textAlign: 'center',
            }}>
              {pct}%
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer tagline */}
      <div style={{
        position: 'absolute',
        bottom: '1.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.55rem',
        fontWeight: 750,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(5,44,101,0.35)',
        whiteSpace: 'nowrap',
      }}>
        Global Intelligence · Precision Engineering
      </div>
    </motion.div>
  );
}

export default function SolutionsClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [solutions, setSolutions] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSolutions(retries = 3) {
      try {
        // Force minimum 1.5s delay so the loading animation is visible
        const [res] = await Promise.all([
          fetch("/api/solutions"),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setSolutions(Array.isArray(data) ? data : []);
          setDataLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch solutions", err);
        if (retries > 0 && isMounted) {
          setTimeout(() => fetchSolutions(retries - 1), 800);
        } else if (isMounted) {
          setDataLoaded(true);
        }
      }
    }
    fetchSolutions();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="container mx-auto px-6 max-w-6xl">
      {/* Header Section */}
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-black text-[#052c65] tracking-tight mb-8 text-center md:text-left">
          Smart Solutions for <span className="text-[#38bdf8]">Real</span> Problems
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left">
          <p className="text-[#64748b] text-sm max-w-md leading-relaxed mx-auto md:mx-0">
            Precision-engineered tools designed to integrate seamlessly into your corporate infrastructure.
          </p>

          <div className="flex flex-nowrap justify-center md:justify-start gap-2 md:gap-3 w-full overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all border whitespace-nowrap shrink-0 ${
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

      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoader && (
          <FullPageLoader 
            isLoaded={dataLoaded} 
            onComplete={() => setShowLoader(false)} 
          />
        )}
      </AnimatePresence>

      {/* Solutions List */}
      <div className={`space-y-24 md:space-y-32 transition-opacity duration-700 ${showLoader ? "opacity-0" : "opacity-100"}`}>
        {!showLoader && Array.isArray(solutions) && solutions.length > 0 ? (
          solutions.map((sol, index) => {
             const visualNumber = (index + 1).toString().padStart(2, "0");
            
            // Check if it matches category filter (basic implementation)
            if (activeCategory !== "All" && sol.badge !== "CONSULTANCY" && activeCategory === "Consultancy & Services") return null;
            if (activeCategory !== "All" && sol.badge === "CONSULTANCY" && activeCategory === "Software Solutions") return null;

            return (
              <Link href={`/solutions/${sol.slug || sol.id}`} key={sol.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex flex-row gap-4 md:gap-16 lg:gap-24 items-center justify-between w-full"
                >
                  {/* Image Column — Left */}
                  <div className="w-[42%] md:w-[45%] lg:w-[42%] shrink-0">
                    <div className="relative aspect-[4/3] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                      <img src={sol.thumbnail_image || sol.detail_image_1 || "/placeholder.jpg"} alt={sol.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                    </div>
                  </div>

                  {/* Content Column — Right */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-3xl md:text-7xl lg:text-8xl font-black text-[#a5f3fc] leading-none mb-2 md:mb-4 tracking-tighter opacity-90">
                      {visualNumber}
                    </div>

                    <div className="mb-2 md:mb-4">
                      <span className="px-2 md:px-4 py-1 md:py-1.5 bg-[#e0f2fe] text-[#0ea5e9] rounded-full text-[8px] md:text-[11px] font-black uppercase tracking-widest inline-block">
                        {sol.badge || "SOFTWARE SOLUTION"}
                      </span>
                    </div>

                    <h2 className="text-sm md:text-3xl lg:text-4xl font-black uppercase tracking-tight mb-2 md:mb-4 text-[#052c65] group-hover:text-[#2563eb] transition-colors duration-300 leading-tight">
                      {sol.title}
                    </h2>

                    <p className="hidden md:block text-[#64748b] text-[13px] md:text-[15px] leading-relaxed max-w-[90%] lg:max-w-xl mb-8">
                      {sol.description}
                    </p>

                    <span className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-8 py-2 md:py-3.5 rounded-full text-[10px] md:text-[13px] font-bold transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-0.5 w-max text-white bg-[#052c65] group-hover:bg-[#167fa8]">
                      Learn More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })
        ) : !showLoader && dataLoaded && (!Array.isArray(solutions) || solutions.length === 0) ? (
          <div className="flex justify-center items-center py-20 text-red-500 font-bold">
            Failed to load solutions. Data is not an array. Please try refreshing the page.
          </div>
        ) : null}
      </div>
    </div>
  );
}
