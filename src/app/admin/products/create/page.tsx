"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, AlertCircle, Type, AlignLeft, Tags, List, Image as ImageIcon, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateProduct() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "",
    tagColor: "#4ade80",
    description: "",
    highlights: "", // Comma separated
    ctaText: "Request Demo",
    imageUrl: "",
    websiteUrl: "",
    orderIndex: "0",
    status: "Active",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.src = ev.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Product title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const highlightsArray = formData.highlights.split(',').map(h => h.trim()).filter(h => h !== "");
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          highlights: highlightsArray,
          orderIndex: parseInt(formData.orderIndex) || 0,
        }),
      });

      if (response.ok) {
        router.push("/admin/solutions");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create product.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/solutions" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Add Product Solution</h2>
            <p className="text-[var(--text-secondary)] mt-1">Create a platform card for the Solutions page.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Saving..." : "Save Product"}
        </button>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                <Type size={14} />
                Product Title
              </label>
              <input 
                type="text" 
                placeholder="Ex: FIDA HRIS, Enterprise ERP..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-lg font-bold text-white"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Subtitle / Slogan</label>
              <input 
                type="text" 
                placeholder="Complete Workforce Management..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white font-medium"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                        <Tags size={14} />
                        Tag (Category)
                    </label>
                    <input 
                        type="text" 
                        placeholder="HR Automation" 
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white"
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Tag Color (Hex)</label>
                    <div className="flex gap-4">
                        <input 
                            type="color" 
                            className="w-16 h-14 bg-transparent border-none cursor-pointer"
                            value={formData.tagColor}
                            onChange={(e) => setFormData({...formData, tagColor: e.target.value})}
                        />
                        <input 
                            type="text" 
                            className="flex-1 bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white"
                            value={formData.tagColor}
                            onChange={(e) => setFormData({...formData, tagColor: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                <AlignLeft size={14} />
                Main Description
              </label>
              <textarea 
                rows={4}
                placeholder="Describe the solution platform..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                <List size={14} />
                Key Features (Comma separated)
              </label>
              <textarea 
                rows={3}
                placeholder="Cloud-based Payroll, Employee Self-Service, Attendance Tracking..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white resize-none"
                value={formData.highlights}
                onChange={(e) => setFormData({...formData, highlights: e.target.value})}
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 ml-1">Separate each feature with a comma.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-[var(--green)]" />
              Product Image
            </h3>
            
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-2xl border-2 border-dashed border-[var(--grey-dark)] flex flex-col items-center justify-center gap-2 group hover:border-[var(--green)] transition-smooth cursor-pointer bg-[var(--bg-elevated)]/30 overflow-hidden relative"
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--green)] transition-smooth">
                      <Plus size={24} />
                    </div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Upload Overview Image</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                    <LinkIcon size={14} />
                    External Website URL
                </label>
                <input 
                    type="url" 
                    placeholder="https://hris.fidaglobal.com"
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">CTA Button Text</label>
                <input 
                    type="text" 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Display Order</label>
                <input 
                    type="number" 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm text-white font-bold"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({...formData, orderIndex: e.target.value})}
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--grey-dark)]">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</label>
                <div className="grid grid-cols-2 gap-2">
                    {["Inactive", "Active"].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s})}
                        className={`py-3 rounded-xl text-xs font-bold transition-smooth ${formData.status === s ? 'bg-[var(--green-glow)] text-[var(--green)] border border-[var(--green)]/30' : 'bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--grey-dark)] text-[var(--text-secondary)]'}`}
                    >
                        {s}
                    </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
