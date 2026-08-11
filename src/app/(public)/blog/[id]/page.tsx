"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ChevronLeft, Share2, Loader2 } from "lucide-react";
import Link from "next/link";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] text-[var(--text-muted)]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-sm tracking-widest uppercase font-bold">Retrieving Insight...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)]">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Insight Not Found</h1>
        <Link href="/blog" className="px-8 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--grey-dark)] transition-smooth">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="public-pastel-page min-h-screen pb-20">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--green-glow)] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--blue-glow)] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32 lg:pt-40">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-10 transition-smooth group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-smooth" />
          Back to Insights
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="space-y-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <span className="px-4 py-1.5 rounded-full bg-[var(--green-glow)] text-[var(--green)] text-xs font-bold uppercase tracking-widest border border-[var(--green)]/20">
                {blog.cat}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] text-[var(--text-primary)] tracking-tight"
            >
              {blog.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-[var(--text-muted)] border-b border-[var(--grey-dark)] pb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--grey-dark)]">
                  <User size={14} className="text-[var(--green)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">{new Date(blog.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">6 min read</span>
              </div>
              <button className="ml-auto p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--grey-dark)] transition-smooth text-[var(--text-primary)]">
                <Share2 size={18} />
              </button>
            </motion.div>
          </header>

          {/* Featured Image */}
          {blog.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-[40px] overflow-hidden mb-16 shadow-2xl border border-[var(--grey-dark)] aspect-video relative"
            >
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-lg max-w-none 
              prose-headings:text-[var(--text-primary)] prose-headings:font-bold 
              prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
              prose-strong:text-[var(--text-primary)] prose-a:text-[var(--blue-dark)] hover:prose-a:underline
              prose-img:rounded-3xl prose-img:border prose-img:border-[var(--grey-dark)]
              prose-img:max-w-[240px] prose-img:mx-0"
          >
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </motion.div>

          <footer className="mt-20 pt-10 border-t border-[var(--grey-dark)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--blue)] flex items-center justify-center font-bold text-white text-xl">
                 F
               </div>
               <div>
                  <h4 className="font-bold text-[var(--text-primary)]">FIDA Global Insights</h4>
                  <p className="text-xs text-[var(--text-muted)]">Distributed Intelligence for the Modern Enterprise</p>
               </div>
            </div>
            <Link href="/blog" className="px-8 py-3 rounded-2xl bg-[#052c65] text-white font-bold hover:bg-[#167fa8] hover:scale-[1.02] transition-smooth">
               Read More Insights
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
