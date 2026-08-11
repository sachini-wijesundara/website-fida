"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SolutionsManagement() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (editingItem) {
      setImagePreview(editingItem.thumbnail_image || "");
    } else {
      setImagePreview("");
    }
  }, [editingItem]);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const res = await fetch("/api/solutions");
      const data = await res.json();
      setSolutions(data);
    } catch (err) {
      console.error("Failed to fetch solutions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this solution?")) return;
    try {
      const res = await fetch(`/api/solutions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSolutions(solutions.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      id: editingItem?.id || null,
      title: formData.get("title"),
      badge: formData.get("badge"),
      description: formData.get("description"),
      thumbnail_image: imagePreview,
      orderIndex: parseInt(formData.get("orderIndex") as string) || 0,
      status: formData.get("status") || "Active"
    };

    try {
      const res = await fetch("/api/solutions", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSolutions();
      } else {
        const errorData = await res.json();
        alert("Failed to save: " + errorData.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = solutions.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.badge?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading solutions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Solutions Management</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage solutions displayed on the public site.</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg"
        >
          <Plus size={20} />
          Add Solution
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] focus-within:text-[var(--blue)] transition-smooth" size={18} />
          <input
            type="text"
            placeholder="Search by title or badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-smooth text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-elevated)]/50 border-b border-[var(--grey-dark)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Thumbnail</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Solution</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Order</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--grey-dark)]">
              {filtered.map((t) => (
                <tr key={t.id} className="group hover:bg-[var(--bg-elevated)]/30 transition-smooth">
                  <td className="px-6 py-5 w-24">
                    <div className="w-16 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 overflow-hidden">
                      {t.thumbnail_image ? <img src={t.thumbnail_image} className="w-full h-full object-cover" /> : <ImageIcon size={20} />}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-sm">{t.title}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-[var(--blue)] bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{t.badge || "SOLUTION"}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-1 max-w-md mt-1">{t.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold">{t.order_index}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-[var(--text-muted)]">
                      <Link href={`/admin/solutions/${t.id}`} className="p-2 hover:bg-white/5 rounded-lg hover:text-green-400 transition-colors" title="Edit Template">
                        <LayoutTemplate size={16} />
                      </Link>
                      <button onClick={() => { setEditingItem(t); setIsModalOpen(true); }} className="p-2 hover:bg-white/5 rounded-lg hover:text-blue-400 transition-colors" title="Edit Basic Info">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-white/5 rounded-lg hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">No solutions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="admin-modal-overlay absolute inset-0 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="admin-modal relative w-full max-w-xl border rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">{editingItem ? "Edit Solution" : "New Solution"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Title</label>
                      <input name="title" defaultValue={editingItem?.title} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" placeholder="e.g. SMART HRIS" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Badge</label>
                      <input name="badge" defaultValue={editingItem?.badge} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" placeholder="e.g. SOFTWARE SOLUTION" />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</label>
                   <textarea name="description" defaultValue={editingItem?.description} required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" placeholder="Description of the solution..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Order Index</label>
                      <input name="orderIndex" type="number" defaultValue={editingItem?.order_index || 0} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</label>
                      <select name="status" defaultValue={editingItem?.status || 'Active'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none">
                         <option value="Active">Active</option>
                         <option value="Inactive">Inactive</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Thumbnail Upload</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                             };
                             reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Image (Live Preview)</label>
                      <input 
                        name="thumbnail_image" 
                        value={imagePreview} 
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
                        placeholder="Paste URL or upload image..." 
                      />
                   </div>
                   {imagePreview && (
                     <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                        <img src={imagePreview} className="w-full h-full object-cover" />
                     </div>
                   )}
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                  {editingItem ? "Update Solution" : "Save Solution"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
