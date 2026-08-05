"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Loader2 } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const gradients = [
  "from-primary/20 to-transparent",
  "from-blue-500/20 to-transparent",
  "from-purple-500/20 to-transparent",
  "from-orange-500/20 to-transparent",
  "from-cyan-500/20 to-transparent",
  "from-green-500/20 to-transparent",
];

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        // Take the latest 7 published posts
        setPosts(list.slice(0, 7));
      } catch (err) {
        console.error("Failed to fetch homepage blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Opening Knowledge Base...</p>
      </div>
    );
  }

  if (posts.length === 0) return null;

  const featured = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <section className="py-32 relative" id="blog">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
        >
          <div className="space-y-4">
            <div className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full inline-flex">
              Insights & Expertise
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
              From Our{" "}
              <span className="text-primary italic">Knowledge</span>
              <br />
              Base
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 glass border px-6 py-3 rounded-full font-semibold text-sm text-[var(--text-primary)] hover:border-primary/40 transition-smooth"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Featured post (large) */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Link href={`/blog/${featured.id}`} className="block group">
              <div className="relative overflow-hidden rounded-[2.5rem] glass border border-transparent hover:border-primary/30 p-12 lg:p-16 transition-smooth hover:shadow-2xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[0]} opacity-60 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {featured.category_name || featured.cat}
                      </span>
                      {featured.status === 'Published' && (
                        <span className="text-xs font-bold uppercase tracking-widest text-white bg-primary px-3 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--blue-dark)] transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-lg line-clamp-2">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-5 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {new Date(featured.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> 5 min read
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end order-first lg:order-last">
                    <div className="relative w-full aspect-video lg:aspect-square max-w-sm rounded-[2rem] overflow-hidden border border-[#052c65]/10">
                      {featured.imageUrl ? (
                        <img src={featured.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-transparent" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid of posts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {gridPosts.map((post, idx) => (
            <motion.div key={post.id} variants={cardVariants}>
              <Link href={`/blog/${post.id}`} className="block group h-full">
                <div className="relative overflow-hidden rounded-[2rem] glass border border-transparent hover:border-primary/20 p-8 h-full flex flex-col space-y-5 transition-smooth hover:shadow-xl hover:-translate-y-1">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[(idx + 1) % gradients.length]} opacity-40 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category_name || post.cat}
                    </span>
                  </div>
                  <h3 className="relative z-10 text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--blue-dark)] transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="relative z-10 text-muted text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
