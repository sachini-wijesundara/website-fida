"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  cat?: string;
  author?: string;
  date?: string | null;
  orderIndex?: number;
}

interface BlogClientProps {
  initialBlogs?: BlogPost[];
}

export default function BlogClient({ initialBlogs = [] }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogs || []);
  const [loading, setLoading] = useState(initialBlogs.length === 0);

  useEffect(() => {
    if (initialBlogs.length > 0) {
      setPosts(initialBlogs);
      setLoading(false);
      return;
    }
    async function fetchBlogs() {
      try {
        const res = await fetch(`/api/blogs?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [initialBlogs]);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="relative pb-20 md:pb-28 overflow-hidden">
      {/* ── Ambient Background Glows matching rest of site ── */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[350px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(186, 230, 253, 0.4) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(167, 243, 208, 0.25) 0%, transparent 70%)" }}
      />

      {/* ── 1. Page Header ── */}
      <section className="pt-36 md:pt-44 pb-10 md:pb-12 text-center max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-blue-50 text-[#0047e1] border border-blue-100/80 shadow-sm mb-5"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#0047e1]" />
          <span>Insights & Thought Leadership</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#052c65] uppercase tracking-tight leading-[1.1] mb-4"
        >
          Direct Insights from <br className="hidden sm:block" />
          <span className="text-[#0047e1] italic font-serif normal-case">Enterprise IT</span> Leaders
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-sm sm:text-base text-[#536b8a] font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Practical guides, architectural case studies, and engineering lessons from FIDA Global&apos;s technical teams shaping the modern distributed enterprise.
        </motion.p>

      </section>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-pulse">
              <div className="rounded-2xl aspect-[16/11] bg-slate-200" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-10 bg-slate-200 rounded-full w-36 mt-4" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 animate-pulse">
                  <div className="rounded-2xl aspect-[16/10] bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm my-12 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#052c65] mb-2">No Articles Found</h3>
            <p className="text-[#536b8a] text-xs sm:text-sm leading-relaxed">
              No articles found. Check back soon for fresh technical insights.
            </p>
          </div>
        )}

        {/* ── 2. Featured Post Hero Card (Only on default view) ── */}
        {!loading && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-[0_15px_45px_rgba(5,44,101,0.06)] hover:shadow-[0_20px_55px_rgba(0,71,225,0.1)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center group">
              {/* Featured Image Container */}
              <Link
                href={`/blog/${featuredPost.id}`}
                className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 relative group flex items-center justify-center block"
              >
                {featuredPost.imageUrl && featuredPost.imageUrl.trim() !== "" ? (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                {/* Branded fallback gradient banner if post has no image */}
                {(!featuredPost.imageUrl || featuredPost.imageUrl.trim() === "") && (
                  <div className="w-full h-full bg-gradient-to-br from-[#052c65] via-[#0047e1] to-[#00a8e8] p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-blue-200">
                        Featured Insight
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <BookOpen className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <span className="relative z-10 text-xl font-bold tracking-tight text-white/95 line-clamp-3">
                      {featuredPost.title}
                    </span>
                  </div>
                )}
              </Link>

              {/* Featured Content Right */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full py-1">
                <div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-black text-[#052c65] group-hover:text-[#0047e1] transition-colors leading-[1.2] mb-4">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-[#536b8a] text-sm sm:text-base leading-relaxed mb-6 line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Action Link */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0047e1] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0037b0] hover:scale-105 transition-all shadow-md shadow-blue-500/20"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3. Grid Articles ── */}
        {!loading && gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {gridPosts.map((post, idx) => {
              return (
                <motion.div
                  key={post.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * idx }}
                  className="flex"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(5,44,101,0.05)] hover:shadow-[0_20px_50px_rgba(0,71,225,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group w-full"
                  >
                    <div>
                      {/* Thumbnail Image Container */}
                      <div className="relative h-48 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                        {post.imageUrl && post.imageUrl.trim() !== "" ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}

                        {(!post.imageUrl || post.imageUrl.trim() === "") && (
                          <div className="w-full h-full p-6 flex flex-col justify-between text-white relative bg-gradient-to-br from-[#052c65] via-[#0047e1] to-[#38a3f5]">
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200">
                                FIDA Insights
                              </span>
                              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <BookOpen className="w-3 h-3 text-white" />
                              </span>
                            </div>
                            <span className="relative z-10 text-sm font-bold tracking-tight text-white/95 line-clamp-2">
                              {post.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#052c65] group-hover:text-[#0047e1] transition-colors leading-snug mb-2.5 line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-[#536b8a] leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-[#536b8a]">
                      <span className="font-bold text-[#0047e1] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
