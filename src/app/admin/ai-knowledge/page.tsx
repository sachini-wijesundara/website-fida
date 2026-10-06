"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Database, AlertCircle, Bot, Loader2, Sparkles, BookOpen, Video } from "lucide-react";

export default function AiKnowledgePanel() {
  const [activeTab, setActiveTab] = useState<"articles" | "youtube">("articles");
  
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [form, setForm] = useState({ category: "Product", title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  const [ytEntries, setYtEntries] = useState<any[]>([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [ytAdding, setYtAdding] = useState(false);
  const [ytDeleting, setYtDeleting] = useState<number | null>(null);
  const [ytForm, setYtForm] = useState({ YouTubeURL: "", Sector: "" });

  useEffect(() => {
    fetchEntries();
    fetchYtEntries();
  }, []);

  const fetchYtEntries = async () => {
    try {
      setYtLoading(true);
      const res = await fetch("/api/admin/youtube-links");
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setYtEntries(data.data);
      } else if (Array.isArray(data)) {
        setYtEntries(data);
      } else {
        setYtEntries([]);
      }
    } catch (err) {
      console.error(err);
      setYtEntries([]);
    } finally {
      setYtLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai-knowledge");
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setEntries(data.data);
      } else if (Array.isArray(data)) {
        setEntries(data);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error(err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/ai-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ category: "Product", title: "", content: "" });
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
    if (!window.confirm("Delete this AI knowledge entry?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/ai-knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddYt = async (e: React.FormEvent) => {
    e.preventDefault();
    setYtAdding(true);
    try {
      const res = await fetch("/api/admin/youtube-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ytForm),
      });
      if (res.ok) {
        setYtForm({ YouTubeURL: "", Sector: "" });
        setShowForm(false);
        fetchYtEntries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setYtAdding(false);
    }
  };

  const handleDeleteYt = async (id: number) => {
    if (!window.confirm("Delete this YouTube link?")) return;
    setYtDeleting(id);
    try {
      await fetch("/api/admin/youtube-links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchYtEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setYtDeleting(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Bot className="text-purple-400" size={36} />
              AI Training Data
            </h1>
            <p className="text-[var(--text-muted)] mt-2">Manage knowledge base articles and YouTube context for the FIDA AI Chatbot.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
              showForm ? "bg-white/10 text-white" : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            }`}
          >
            {showForm ? <XIcon size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : activeTab === "articles" ? "Add Training Data" : "Add YouTube Link"}
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 pb-2">
          <button
            onClick={() => { setActiveTab("articles"); setShowForm(false); }}
            className={`px-4 py-2 font-bold transition-all text-sm flex items-center gap-2 ${
              activeTab === "articles" ? "text-purple-400 border-b-2 border-purple-500" : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <BookOpen size={16} /> Text Articles
          </button>
          <button
            onClick={() => { setActiveTab("youtube"); setShowForm(false); }}
            className={`px-4 py-2 font-bold transition-all text-sm flex items-center gap-2 ${
              activeTab === "youtube" ? "text-purple-400 border-b-2 border-purple-500" : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Video size={16} /> YouTube Links
          </button>
        </div>
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {activeTab === "articles" ? (
                  <><Sparkles size={20} className="text-purple-400" /> Train the AI Model</>
                ) : (
                  <><Video size={20} className="text-purple-400" /> Add YouTube Context</>
                )}
              </h2>
              
              {activeTab === "articles" ? (
                <form onSubmit={handleAdd} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Category</label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="Product">Product Details</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Title / Subject</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Smart HRIS Multi-Company Logic"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Knowledge Content</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Provide the exact answers and explanations the AI should learn for this topic..."
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20 resize-y"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      disabled={adding || !form.title || !form.content}
                      type="submit"
                      className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all disabled:opacity-50"
                    >
                      {adding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                      {adding ? "Saving to Knowledge Base..." : "Inject into AI Knowledge Base"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddYt} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Sector (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Healthcare, Finance"
                        value={ytForm.Sector}
                        onChange={(e) => setYtForm({ ...ytForm, Sector: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">YouTube URL</label>
                      <input
                        required
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={ytForm.YouTubeURL}
                        onChange={(e) => setYtForm({ ...ytForm, YouTubeURL: e.target.value })}
                        className="w-full rounded-2xl px-5 py-4 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      disabled={ytAdding || !ytForm.YouTubeURL}
                      type="submit"
                      className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all disabled:opacity-50"
                    >
                      {ytAdding ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                      {ytAdding ? "Saving Link..." : "Add YouTube Link"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Database Listing */}
      <div className="rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--bg-elevated)] backdrop-blur-md shadow-2xl relative">
        <div className="overflow-x-auto min-h-[400px]">
          {activeTab === "articles" ? (
            loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div>
            ) : (!Array.isArray(entries) || entries.length === 0) ? (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <BookOpen size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Training Data Yet</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                  The AI model currently relies only on its base prompt. Add custom data here to train it on your enterprise products.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] w-48">Category</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] w-1/3">Title</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Content Preview</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(Array.isArray(entries) ? entries : []).map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          entry.category === "Product" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                          entry.category === "Solution" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                          "bg-gray-500/10 border-gray-500/20 text-gray-400"
                        }`}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-sm">
                          {entry.title}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
                          ID: {entry.id} · Added: {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-[var(--text-muted)] line-clamp-2 max-w-xl pr-10">
                          {entry.content}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          title="Delete Entry"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleting === entry.id}
                          className="p-2.5 rounded-2xl bg-red-500/5 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                        >
                          {deleting === entry.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            ytLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div>
            ) : (!Array.isArray(ytEntries) || ytEntries.length === 0) ? (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Video size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No YouTube Links Yet</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                  Add YouTube video links here to provide multimedia context for the AI model.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] w-48">Sector</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">YouTube URL</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(Array.isArray(ytEntries) ? ytEntries : []).map((entry) => (
                    <motion.tr
                      key={entry.LinkID}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        {entry.Sector ? (
                          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                            {entry.Sector}
                          </span>
                        ) : (
                          <span className="text-sm text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <a 
                          href={entry.YouTubeURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold text-blue-400 text-sm hover:underline"
                        >
                          {entry.YouTubeURL}
                        </a>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
                          ID: {entry.LinkID} · Added: {new Date(entry.CreatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          title="Delete Entry"
                          onClick={() => handleDeleteYt(entry.LinkID)}
                          disabled={ytDeleting === entry.LinkID}
                          className="p-2.5 rounded-2xl bg-red-500/5 text-red-500/50 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                        >
                          {ytDeleting === entry.LinkID ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )
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
