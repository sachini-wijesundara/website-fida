"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function BlogClient() {
  const [active, setActive] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const url = active === "All" ? "/api/blogs" : `/api/blogs?category=${encodeURIComponent(active)}`;
        const [blogsRes, catsRes] = await Promise.all([
          fetch(url),
          fetch("/api/categories")
        ]);
        
        const blogsData = await blogsRes.json();
        const catsData = await catsRes.json();
        
        setPosts(blogsData);
        if (categories.length <= 1) { // Only set categories on first load
          setCategories(["All", ...catsData.map((c: any) => c.name)]);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [active]);

  const filtered = posts; // Server side filtering already applied

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading insights...</p>
      </div>
    );
  }

  const getPostColor = (cat: string) => {
    const colors: any = {
      "Infrastructure": "var(--green)",
      "Cybersecurity": "var(--blue)",
      "Cloud": "var(--blue)",
      "AI & Data": "var(--green)",
      "Digital Transformation": "var(--green)",
      "Managed Services": "var(--blue)"
    };
    return colors[cat] || "var(--grey)";
  };

  return (
    <section className="py-16 container mx-auto px-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-14 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-smooth"
            style={{
              background: active === cat ? "var(--green)" : "var(--bg-elevated)",
              color: active === cat ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${active === cat ? "var(--green)" : "var(--grey-dark)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => {
            const color = getPostColor(post.cat);
            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
              >
                <Link href={`/blog/${post.id}`} className="block group h-full">
                  <div className="glass rounded-3xl p-8 h-full flex flex-col space-y-5 transition-smooth hover:-translate-y-2 card-hover-blue relative overflow-hidden">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${color}15`, color: color }}>
                        {post.cat}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>Article</span>
                    </div>

                    <h3 className="text-base font-bold leading-snug flex-1 group-hover:transition-colors" style={{ color: "var(--text-primary)" }}>
                      {post.title}
                    </h3>

                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--grey-dark)" }}>
                      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5 min</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color: color }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-[var(--text-muted)]">
          <p>No published articles found in this category.</p>
        </div>
      )}
    </section>
  );
}
