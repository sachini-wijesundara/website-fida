"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ChevronLeft, Share2, Loader2, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr?: string) {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return "Recent";
  }
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch (err) {
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#0047e1]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-xs tracking-widest uppercase font-bold text-[#536b8a]">Retrieving Insight...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-[#052c65]">Insight Not Found</h1>
        <p className="text-[#536b8a] text-sm">The article you are looking for may have been moved or removed.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0047e1] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0037b0] transition-colors shadow-lg"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="public-pastel-page min-h-screen pb-28">
      {/* Background ambient glows matching Home */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/30 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-36 lg:pt-44 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#536b8a] hover:text-[#0047e1] mb-10 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        <article className="mx-auto">
          {/* Header */}
          <header className="space-y-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0047e1] text-xs font-bold uppercase tracking-wider border border-blue-100">
                {blog.cat || "Insight"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] text-[#052c65] uppercase tracking-tight"
            >
              {blog.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-[#536b8a] border-b border-slate-200/80 pb-6 text-xs sm:text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0047e1] flex items-center justify-center font-bold text-xs">
                  <User size={14} />
                </div>
                <span className="font-bold text-[#052c65]">{blog.author || "FIDA Team"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar size={15} />
                <span suppressHydrationWarning>
                  {formatDate(blog.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={15} />
                <span>5 min read</span>
              </div>
            </motion.div>
          </header>

          {/* Featured Image */}
          {blog.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-100 aspect-video relative bg-slate-100"
            >
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg max-w-none text-[#536b8a]
              prose-headings:text-[#052c65] prose-headings:font-bold prose-headings:tracking-tight
              prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
              prose-strong:text-[#052c65] prose-a:text-[#0047e1] hover:prose-a:underline
              prose-img:rounded-3xl prose-img:border prose-img:border-slate-100"
          >
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </motion.div>

          <footer className="mt-16 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047e1] to-[#38a3f5] flex items-center justify-center font-black text-white text-xl shadow-md">
                F
              </div>
              <div>
                <h4 className="font-bold text-[#052c65]">FIDA Global Insights</h4>
                <p className="text-xs text-[#536b8a]">Enterprise Technology & Thought Leadership</p>
              </div>
            </div>
            <Link
              href="/blog"
              className="px-8 py-3.5 rounded-full bg-[#0047e1] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#0037b0] hover:scale-105 transition-all shadow-md shadow-blue-500/20"
            >
              Explore More Insights
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
