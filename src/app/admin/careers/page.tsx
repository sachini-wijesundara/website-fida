"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Database, Briefcase, Loader2, MapPin, Clock } from "lucide-react";

export default function CareersAdminPanel() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [form, setForm] = useState({ title: "", dept: "", type: "Full-time", location: "", color: "var(--green)" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", dept: "", type: "Full-time", location: "", color: "var(--green)" });
        setShowForm(false);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this job posting?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-blue-400" size={36} />
            Manage Careers
          </h1>
          <p className="text-[var(--text-muted)] mt-2">Publish and manage open job positions for the FIDA Global Careers page.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            showForm ? "bg-white/10 text-white" : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          }`}
        >
          {showForm ? <XIcon size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Publish New Job"}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border)] mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-blue-400" />
                Job Details
              </h2>
              
              <form onSubmit={handleAdd} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Job Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Senior Cloud Engineer"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Department</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Infrastructure"
                      value={form.dept}
                      onChange={(e) => setForm({ ...form, dept: e.target.value })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Location</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dubai / Remote"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Type</label>
                      <select
                        required
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Theme Color</label>
                      <select
                        required
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="var(--green)">Green</option>
                        <option value="var(--blue)">Blue</option>
                        <option value="var(--grey-light)">Light Grey</option>
                        <option value="#a855f7">Purple</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    disabled={adding || !form.title || !form.dept}
                    type="submit"
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
                  >
                    {adding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                    {adding ? "Publishing..." : "Publish Job Post"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Listing */}
      <div className="rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--bg-elevated)] backdrop-blur-md shadow-2xl relative">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : (!Array.isArray(jobs) || jobs.length === 0) ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Briefcase size={32} className="text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Active Job Posts</h3>
              <p className="text-[var(--text-muted)] max-w-sm">
                The careers page is empty. Publish open positions to attract new talent.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Job Title & Dept</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Location & Type</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(Array.isArray(jobs) ? jobs : []).map((job) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full" style={{ background: job.color }} />
                        <div>
                          <div className="font-bold text-white text-[15px]">
                            {job.title}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
                            {job.dept} · Added: {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                         <span className="flex items-center gap-1.5 text-xs text-white/70">
                           <MapPin size={14} className="text-blue-400" /> {job.location}
                         </span>
                         <span className="flex items-center gap-1.5 text-xs text-white/70">
                           <Clock size={14} className="text-green-400" /> {job.type}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        title="Delete Job"
                        onClick={() => handleDelete(job.id)}
                        disabled={deleting === job.id}
                        className="p-2.5 rounded-2xl bg-red-500/5 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                      >
                        {deleting === job.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function XIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
