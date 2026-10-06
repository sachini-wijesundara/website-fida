"use client";

import React, { useState, useEffect } from "react";
import { Mail, Search, Trash2, Clock, Loader2, Download, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    try {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      } else {
        setSubscribers([]);
      }
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  function handleExportCSV() {
    const rows = [["Email", "Subscribed At"], ...subscribers.map((s) => [s.email, new Date(s.subscribed_at).toLocaleString()])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter((s) =>
    (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Newsletter Subscribers</h2>
          <p className="text-[var(--text-muted)] mt-1">
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full bg-[var(--bg-elevated)] border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--green)]/50 transition-smooth"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--green)] text-black font-bold text-sm hover:opacity-90 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-3xl border border-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--green)]/10 flex items-center justify-center">
            <Users size={22} className="text-[var(--green)]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total</p>
            <p className="text-2xl font-black text-white">{subscribers.length}</p>
          </div>
        </div>
        <div className="glass rounded-3xl border border-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Clock size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">This Month</p>
            <p className="text-2xl font-black text-white">
              {subscribers.filter((s) => {
                const d = new Date(s.subscribed_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
        <div className="glass rounded-3xl border border-white/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <Mail size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Today</p>
            <p className="text-2xl font-black text-white">
              {subscribers.filter((s) => {
                const d = new Date(s.subscribed_at);
                const now = new Date();
                return d.toDateString() === now.toDateString();
              }).length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--green)]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-medium">
              {searchTerm ? "No subscribers match your search." : "No subscribers yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">#</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Email</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Subscribed At</th>
                  <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((sub, idx) => (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-smooth group"
                    >
                      <td className="px-8 py-5 text-sm font-bold text-[var(--text-muted)]">{idx + 1}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--green)]/10 flex items-center justify-center flex-shrink-0">
                            <Mail size={14} className="text-[var(--green)]" />
                          </div>
                          <span className="text-sm font-semibold text-white">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-[var(--text-muted)]">
                        {new Date(sub.subscribed_at).toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`mailto:${sub.email}`}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-smooth"
                            title="Send email"
                          >
                            <Mail size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={deletingId === sub.id}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-smooth disabled:opacity-50"
                            title="Remove subscriber"
                          >
                            {deletingId === sub.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
