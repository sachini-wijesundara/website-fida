"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, Loader2, Award, Zap, Shield, Database, Cloud, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpertiseManagement() {
  const [expertise, setExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpertise() {
      try {
        const res = await fetch("/api/expertise");
        const data = await res.json();
        setExpertise(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch expertise:", err);
        setExpertise([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExpertise();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expertise module?")) return;
    
    try {
      const res = await fetch(`/api/expertise?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpertise(expertise.filter(e => e.id !== id));
      } else {
        alert("Failed to delete expertise");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting expertise");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading expertise modules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Our Expertise</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage the core capabilities and services displayed on the home page.</p>
        </div>
        <Link
          href="/admin/expertise/create"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)]"
        >
          <Plus size={20} />
          Add Expertise
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {(Array.isArray(expertise) ? expertise : []).map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-3xl p-8 border border-[var(--grey-dark)] relative group hover:border-[var(--green)] transition-smooth"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] text-[var(--green)] border border-[var(--green)]/20 shadow-lg shadow-[var(--green-glow)]/10">
                  <Award size={32} />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--green)] transition-smooth">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400 transition-smooth"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-white">{exp.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {exp.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--grey-dark)]/50">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Order: {exp.order_index}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${exp.status === 'Published' ? 'bg-[var(--green-glow)] text-[var(--green)]' : 'bg-orange-500/10 text-orange-400'}`}>
                  {exp.status}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button className="rounded-3xl border-2 border-dashed border-[var(--grey-dark)] flex flex-col items-center justify-center gap-4 py-20 group hover:border-[var(--green)] transition-smooth bg-[var(--bg-elevated)]/20">
          <div className="p-4 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--green)] transition-smooth">
            <Plus size={32} />
          </div>
          <p className="text-sm font-bold text-[var(--text-muted)]">Add New Capability</p>
        </button>
      </div>

      {expertise.length === 0 && (
        <div className="py-20 text-center glass rounded-3xl border border-[var(--grey-dark)]">
          <Award className="mx-auto mb-4 text-[var(--text-muted)]" size={48} />
          <p className="text-[var(--text-muted)]">No expertise modules defined yet.</p>
        </div>
      )}
    </div>
  );
}
