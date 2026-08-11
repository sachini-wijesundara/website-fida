"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Filter, Loader2, Briefcase, Layout, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setImagePreview(editingItem.image_url || "");
    } else {
      setImagePreview("");
    }
  }, [editingItem]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(p => p.id !== id));
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
      description: formData.get("description"),
      imageUrl: imagePreview,
      iconName: formData.get("iconName"),
      label: formData.get("label"),
      features: formData.get("features"),
      orderIndex: parseInt(formData.get("orderIndex") as string) || 0,
      status: "Published"
    };

    setIsSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
        alert("Service saved successfully!");
      } else {
        const errorData = await res.json();
        alert("Failed to save: " + errorData.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("Submission error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Initializing Service Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Service Portfolio</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage core services and business offerings.</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Add Service
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all text-sm text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, idx) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-[2rem] border border-white/10 overflow-hidden group hover:border-blue-500/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-white/5">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <Briefcase size={40} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(s); setIsModalOpen(true); }} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-blue-400">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/80">Order: {s.order_index}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest">{s.status}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">{s.label}</p>
                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="admin-modal-overlay absolute inset-0 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="admin-modal relative w-full max-w-xl border rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{editingItem ? "Edit Service" : "New Service Offering"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Service Title</label>
                   <input name="title" defaultValue={editingItem?.title} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none transition-all font-bold" placeholder="e.g. Managed Cloud Infrastructure" />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Description</label>
                   <textarea name="description" defaultValue={editingItem?.description} required rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none resize-none leading-relaxed" placeholder="Detailed service description..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Label / Category</label>
                    <input name="label" defaultValue={editingItem?.label} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. Infrastructure" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Icon Name</label>
                    <select name="iconName" defaultValue={editingItem?.icon_name || "Server"} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      {["Server", "Shield", "Cloud", "Terminal", "Database", "Cpu", "Network", "Settings"].map(icon => (
                        <option key={icon} value={icon} className="bg-black text-white">{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Features (one per line)</label>
                   <textarea name="features" defaultValue={editingItem?.features} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none resize-none leading-relaxed" placeholder="Cloud migration&#10;FinOps&#10;Cost optimization..." />
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Featured Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => { setImagePreview(reader.result as string); };
                             reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-blue-500/10 file:text-blue-400"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Direct Image URL / Base64</label>
                      <input 
                        name="imageUrl" 
                        value={imagePreview} 
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none" 
                        placeholder="Image source..." 
                      />
                   </div>
                   {imagePreview && (
                     <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                        <img src={imagePreview} className="w-full h-full object-cover" />
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Display Order</label>
                      <input name="orderIndex" type="number" defaultValue={editingItem?.order_index || 0} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 outline-none" />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : (editingItem ? "Update Service Offering" : "Save New Service")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
