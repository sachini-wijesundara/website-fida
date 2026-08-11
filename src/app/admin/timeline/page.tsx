"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, Loader2, Sparkles, Activity } from "lucide-react";

export default function TimelineAdminPanel() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [form, setForm] = useState({ year: "", text: "", orderIndex: 0 });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/timeline");
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ year: "", text: "", orderIndex: entries.length });
        setShowForm(false);
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this timeline entry?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/timeline?id=${id}`, {
        method: "DELETE",
      });
      fetchEntries();
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
            <Calendar className="text-[var(--blue)]" size={36} />
            Company History
          </h1>
          <p className="text-[var(--text-muted)] mt-2">Manage the FIDA Global milestones timeline shown on the About page.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            showForm ? "bg-white/10 text-white" : "bg-[var(--blue)] hover:bg-[var(--blue)]/80 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          }`}
        >
          {showForm ? <XIcon size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Milestone"}
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--blue)]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-[var(--blue)]" />
                New Milestone Event
              </h2>
              
              <form onSubmit={handleAdd} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--blue)] mb-2">Year / Date</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 2025"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[var(--blue)] transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--blue)] mb-2">Order Index</label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      value={form.orderIndex}
                      onChange={(e) => setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[var(--blue)] transition-all placeholder:text-white/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--blue)] mb-2">Details (Text)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="e.g. Reached 200+ enterprise clients; awarded 'Best IT Provider' in the GCC."
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[var(--blue)] transition-all placeholder:text-white/20 resize-y"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    disabled={adding || !form.year || !form.text}
                    type="submit"
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--green)] text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
                  >
                    {adding ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
                    {adding ? "Saving..." : "Save Milestone"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Listing */}
      <div className="admin-spectrum-box rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--bg-elevated)] backdrop-blur-md shadow-2xl relative">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--blue)]" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Calendar size={32} className="text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Milestones Added</h3>
              <p className="text-[var(--text-muted)] max-w-sm">
                Your company timeline is currently empty. Add the first huge milestone details above!
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] w-32">Order / Year</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] w-2/3">Event Details</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => (
                  <motion.tr
                    key={entry.TimelineId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="font-black text-2xl text-[var(--blue)]">
                        {entry.Year}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
                        Order Index: {entry.OrderIndex}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                        {entry.Text}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        title="Delete Milestone"
                        onClick={() => handleDelete(entry.TimelineId)}
                        disabled={deleting === entry.TimelineId}
                        className="p-2.5 rounded-2xl bg-red-500/5 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                      >
                        {deleting === entry.TimelineId ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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
