"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, ArrowUpRight, User } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  cat?: string;
  author?: string;
  date?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return "Recent";
  }
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPosts(data.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Failed to fetch blogs for home section:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Architecture":
      case "Cloud":
      case "Cybersecurity":
        return { bg: "bg-blue-50", text: "text-[#0047e1]", border: "border-blue-100" };
      case "AI & Data":
      case "Infrastructure":
        return { bg: "bg-emerald-50", text: "text-[#16a34a]", border: "border-emerald-100" };
      default:
        return { bg: "bg-slate-50", text: "text-[#052c65]", border: "border-slate-200" };
    }
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-white">
      {/* Subtle background glow */}
      <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-blue-50 text-[#0047e1] border border-blue-100/80 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#0047e1]" />
              <span>Insights & Intelligence</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#052c65] uppercase tracking-tight leading-[1.08]">
              Thought Leadership & <br className="hidden sm:block" />
              <span className="text-[#0047e1] italic font-serif normal-case">Tech Insights</span>
            </h2>
            <p className="text-[#536b8a] text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Practical guides, engineering lessons, and strategic perspectives from our teams shaping global technology.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#0047e1] border border-blue-200 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-300 group self-start md:self-end"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 bg-slate-50/70 rounded-3xl border border-slate-100 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="h-44 bg-slate-200 rounded-2xl mb-4" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-6 w-full bg-slate-200 rounded" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => {
              const catStyles = getCategoryColor(post.cat);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="group flex flex-col w-full bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(5,44,101,0.05)] hover:shadow-[0_20px_50px_rgba(0,71,225,0.12)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    {/* Visual Banner / Image */}
                    <div className="relative h-48 w-full bg-gradient-to-br from-[#052c65] via-[#0047e1] to-[#38a3f5] overflow-hidden">
                      {post.imageUrl && post.imageUrl.trim() !== "" ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-6 text-white relative">
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-200">
                              FIDA Insights
                            </span>
                            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                              <BookOpen className="w-3.5 h-3.5 text-white" />
                            </span>
                          </div>
                          <div className="relative z-10">
                            <span className="text-xl font-black tracking-tight opacity-40">
                              # {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Floating Category Pill */}
                      <div className="absolute bottom-3 left-4 z-10">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/95 text-[#0047e1] shadow-sm`}
                        >
                          {post.cat || "Tech"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5" suppressHydrationWarning>
                            <Calendar className="w-3.5 h-3.5 text-[#0047e1]" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            5 min read
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-[#052c65] group-hover:text-[#0047e1] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-[#536b8a] leading-relaxed line-clamp-3 font-normal">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0047e1] flex items-center justify-center font-bold text-[10px]">
                            <User className="w-3 h-3" />
                          </div>
                          <span>{post.author || "FIDA Team"}</span>
                        </div>

                        <span className="flex items-center gap-1 font-bold text-[#0047e1] group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-100 max-w-xl mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-[#0047e1] mx-auto mb-2" />
            <h3 className="text-xl font-bold text-[#052c65]">Fresh Articles Coming Soon</h3>
            <p className="text-sm text-[#536b8a]">
              Our engineers are currently authoring new research papers and architectural studies. Check back shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
