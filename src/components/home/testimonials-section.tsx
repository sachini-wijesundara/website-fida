"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    }
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 public-themed-section relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
            <Quote size={16} />
            <span>Customer Voice</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
            Trusted by <br /><span className="text-[#167fa8] italic">Visionaries</span>
          </h2>
        </div>

        <div className="w-full overflow-x-auto md:overflow-hidden pb-12 pt-4 relative group snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Fade edges for a premium look (Desktop Only) */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          <style>{`
            .marquee-track {
              display: flex;
              width: max-content;
            }
            @media (min-width: 768px) {
              .marquee-track {
                animation: marquee ${testimonials.length * 5}s linear infinite;
              }
              .group:hover .marquee-track {
                animation-play-state: paused;
              }
            }
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>

          <div className="marquee-track px-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id || i}-${i}`}
                className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 flex flex-col w-[85vw] md:w-[400px] shrink-0 mr-6 transition-transform md:hover:-translate-y-2 md:hover:shadow-2xl duration-300 snap-center"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-zinc-50 relative bg-zinc-50">
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.client_name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <UserPlus size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight leading-tight">{t.client_name}</h4>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-[9px] leading-tight mt-1">
                      {t.client_position} {t.client_company && `at ${t.client_company}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm md:text-base text-zinc-600 italic leading-relaxed flex-1">
                  "{t.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
