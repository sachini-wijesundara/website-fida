"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, AlertCircle, Type, AlignLeft, Grid, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateSolution() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "Zap", // Default icon
    orderIndex: "0",
    status: "Active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Solution title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderIndex: parseInt(formData.orderIndex) || 0,
        }),
      });

      if (response.ok) {
        router.push("/admin/features");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create solution.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const icons = ["Zap", "Cpu", "ShieldCheck", "Sparkles", "Layers", "MousePointer2", "Code2", "Smartphone"];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/features" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Add New Solution</h2>
            <p className="text-[var(--text-secondary)] mt-1">Create a new feature solution for the digital age section.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Saving..." : "Save Solution"}
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
                Solution Title
              </label>
              <input 
                type="text" 
                placeholder="Ex: Ultra Fast, Smart Logic..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-lg font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1 flex items-center gap-2">
                <AlignLeft size={14} />
                Description
              </label>
              <textarea 
                rows={4}
                placeholder="Describe this solution briefly..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Display Order</label>
                <input 
                    type="number" 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm font-bold"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({...formData, orderIndex: e.target.value})}
                />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Select Icon</label>
                    <div className="grid grid-cols-4 gap-2">
                        {icons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData({...formData, iconName: icon})}
                                className={`p-3 rounded-xl border transition-smooth flex items-center justify-center ${formData.iconName === icon ? 'bg-[var(--green)]/10 border-[var(--green)] text-[var(--green)]' : 'bg-[var(--bg-elevated)] border-[var(--grey-dark)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}
                                title={icon}
                            >
                                <Lightbulb size={18} />
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 ml-1">Current: {formData.iconName}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
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
      </form>
    </div>
  );
}
