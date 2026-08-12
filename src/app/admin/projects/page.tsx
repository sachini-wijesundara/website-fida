"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, ExternalLink, Filter, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects?summary=true");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading project catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Portfolio</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage client success stories and project showcases.</p>
        </div>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--blue)] to-[var(--blue-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--blue-glow)]"
        >
          <Plus size={20} />
          Add New Project
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--blue)] transition-smooth" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-sm font-medium">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-elevated)]/50 border-b border-[var(--grey-dark)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Project</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--grey-dark)]">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((p) => (
                  <motion.tr
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-[var(--bg-elevated)]/30 transition-smooth"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] overflow-hidden border border-[var(--grey-dark)] shrink-0">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={`${p.title} thumbnail`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                              <Briefcase size={20} />
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-sm group-hover:text-[var(--blue)] transition-smooth">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold px-3 py-1 bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]">
                        {p.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-[var(--text-muted)] font-medium">{p.client_name || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${p.status === 'Published' ? 'bg-[var(--blue-glow)] text-[var(--blue)]' : 'bg-orange-500/10 text-orange-400'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/projects" target="_blank" className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--blue)]">
                          <ExternalLink size={16} />
                        </Link>
                        <Link 
                          href={`/admin/projects/edit/${p.id}`}
                          className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--green)]"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[var(--text-muted)]">No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
