"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}, ${d.getUTCFullYear()}`;
  } catch {
    return "";
  }
}

// Fallbacks matching the live site design
const fallbackFeatured: BlogPost = {
  id: 1,
  title: "Navigating the Multi-Cloud Complexity in 2024: A Strategic Framework",
  excerpt:
    "Enterprises are increasingly finding themselves trapped in vendor lock-in. Our engineers break down the five-pillar strategy for maintaining architectural sovereignty across AWS, Azure, and private cloud deployments.",
  author: "Dr. Marcus Thorne",
  imageUrl: "",
  date: "2024-01-15T00:00:00Z",
};

const fallbackCards: BlogPost[] = [
  {
    id: 101,
    title: "Scaling LLMs for Local Financial Compliance",
    excerpt:
      "How FIDA deployed on-premise generative models for a Tier-1 investment bank while maintaining air-gapped security.",
    date: "2023-10-14T00:00:00Z",
    imageUrl: "",
    author: "FIDA AI Team",
  },
  {
    id: 102,
    title: "Zero Trust: Moving Beyond the VPN Periphery",
    excerpt:
      "Practical steps for dismantling legacy VPN architectures in favor of identity-aware proxy systems.",
    date: "2023-10-10T00:00:00Z",
    imageUrl: "",
    author: "Security Operations",
  },
  {
    id: 103,
    title: "Edge Computing in Modern Logistics",
    excerpt:
      "Reducing latency by 40% through localized processing nodes in distributed supply chain environments.",
    date: "2023-10-05T00:00:00Z",
    imageUrl: "",
    author: "Cloud Infrastructure",
  },
];

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

  // Featured post: first from DB or fallback
  const featuredPost = posts.length > 0 ? posts[0] : fallbackFeatured;

  // Grid posts: remaining from DB, supplemented by fallbacks to ensure full presentation
  const remainingDbPosts = posts.length > 1 ? posts.slice(1) : [];
  const displayGridPosts =
    remainingDbPosts.length >= 3
      ? remainingDbPosts
      : [
          ...remainingDbPosts,
          ...fallbackCards.slice(remainingDbPosts.length),
        ].slice(0, Math.max(3, remainingDbPosts.length));

  return (
    <div className="pb-24 md:pb-32 overflow-hidden">
      {/* ── 1. Page Header matching the live site ── */}
      <section className="pt-36 md:pt-44 pb-12 md:pb-16 text-center max-w-4xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#0f172a] tracking-tight leading-[1.15] mb-4"
        >
          Direct Insights from Enterprise IT{" "}
          <span className="text-[#00a8e8]">Leaders</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Exclusive deep-dives and technical analysis from FIDA&apos;s global network of engineers and security consultants.
        </motion.p>
      </section>

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Loading state */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl aspect-[4/3] lg:aspect-[16/11] bg-slate-200" />
              <div className="space-y-4 py-4">
                <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-[1.75rem] border border-slate-100 p-6 space-y-4"
                >
                  <div className="rounded-2xl aspect-[16/10] bg-slate-200" />
                  <div className="h-4 bg-slate-200 rounded w-20 ml-auto" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 2. Top Featured Post Card ── */}
        {!loading && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(5,44,101,0.06)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Featured Image Container */}
              <Link
                href={`/blog/${featuredPost.id}`}
                className="rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[16/11] bg-slate-900 relative group flex items-center justify-center block"
              >
                {featuredPost.imageUrl && featuredPost.imageUrl.trim() !== "" ? (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                {/* High-tech placeholder if no image is present */}
                {(!featuredPost.imageUrl || featuredPost.imageUrl.trim() === "") && (
                  <div className="w-full h-full bg-gradient-to-br from-[#051937] via-[#004d7a] to-[#008793] p-8 flex flex-col justify-between text-white relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-mono tracking-widest uppercase text-cyan-300">
                        FEATURED ARCHITECTURE
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <span className="text-3xl font-black tracking-tight text-white/90">
                        Enterprise Core
                      </span>
                      <p className="text-xs text-cyan-200/80 font-mono">
                        INFRASTRUCTURE · CLOUD · SECURITY
                      </p>
                    </div>
                  </div>
                )}
              </Link>

              {/* Featured Content Right */}
              <div className="flex flex-col justify-between h-full py-2">
                <div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#0f172a] hover:text-[#0047e1] transition-colors leading-[1.25] mb-4">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Read Link */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0047e1] hover:text-[#0037b0] transition-colors group"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3. Three Columns Grid Below ── */}
        {!loading && displayGridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
            {displayGridPosts.map((post, idx) => {
              return (
                <motion.div
                  key={post.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + idx * 0.08 }}
                  className="flex"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_15px_40px_rgba(5,44,101,0.04)] hover:shadow-[0_20px_50px_rgba(0,71,225,0.1)] hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col justify-between group w-full"
                  >
                    <div>
                      {/* Thumbnail Image Container */}
                      <div className="rounded-2xl aspect-[16/10] overflow-hidden bg-slate-900 mb-5 relative flex items-center justify-center">
                        {post.imageUrl && post.imageUrl.trim() !== "" ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}

                        {/* Fallback graphic placeholder */}
                        {(!post.imageUrl || post.imageUrl.trim() === "") && (
                          <div
                            className={`w-full h-full p-6 flex flex-col justify-between text-white relative ${
                              idx % 3 === 0
                                ? "bg-gradient-to-br from-[#1e3c72] to-[#2a5298]"
                                : idx % 3 === 1
                                ? "bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
                                : "bg-gradient-to-br from-[#141e30] to-[#243b55]"
                            }`}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-widest text-cyan-200 uppercase">
                              <span>Knowledge Base</span>
                              <span>#{String((idx % 9) + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="relative z-10">
                              <span className="text-xl font-bold tracking-tight text-white/90">
                                Tech Analysis
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Date right aligned as in live screenshot */}
                      {post.date && (
                        <p
                          className="text-xs text-slate-400 font-medium mb-3 text-right"
                          suppressHydrationWarning
                        >
                          {formatDate(post.date)}
                        </p>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#0047e1] transition-colors leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
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
