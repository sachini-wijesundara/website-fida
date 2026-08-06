"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Image as ImageIcon, X, Loader2, Plus, AlertCircle, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-[var(--bg-elevated)]/50 rounded-2xl border border-[var(--grey-dark)]">Loading Editor...</div>
});

export default function CreateBlogPost() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    status: "Draft",
  });

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCats();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.content) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          authorId: 1, // Defaulting to admin user ID 1
          categoryId: parseInt(formData.categoryId),
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create blog post.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Quill Editor Configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
    ],
  };

  return (
    <div className="space-y-8 pb-20 admin-quill-container">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create New Post</h2>
            <p className="text-[var(--text-secondary)] mt-1">Draft your next insight for the FIDA community.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-sm font-bold">
            <Eye size={18} />
            Preview
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)] disabled:opacity-50 disabled:scale-100"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
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
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Post Title</label>
              <input 
                type="text" 
                placeholder="Enter a compelling title..." 
                className="w-full bg-[var(--bg-elevated)]/50 border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-lg font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Excerpt</label>
              <textarea 
                rows={3}
                placeholder="Brief summary used in listings..." 
                className="w-full bg-[var(--bg-elevated)]/50 border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm resize-none"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Content Editor</label>
              <div className="bg-[var(--bg-elevated)]/30 rounded-2xl overflow-hidden border border-[var(--grey-dark)] quill-wrapper">
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  modules={modules}
                  className="bg-transparent min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Save size={18} className="text-[var(--green)]" />
              Publishing
            </h3>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {["Draft", "Published"].map((s) => (
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

            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Category</label>
              <select 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm appearance-none cursor-pointer"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              >
                {categories.map(c => <option key={c.id} value={c.id} className="bg-[var(--bg-elevated)]">{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-[var(--blue)]" />
              Cover Photo
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
                className="aspect-video rounded-2xl border-2 border-dashed border-[var(--grey-dark)] flex flex-col items-center justify-center gap-2 group hover:border-[var(--blue)] transition-smooth cursor-pointer bg-[var(--bg-elevated)]/30 overflow-hidden relative"
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
                    <div className="p-3 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--blue)] transition-smooth">
                      <Plus size={24} />
                    </div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Upload from Computer</p>
                  </>
                )}
              </div>
              <p className="text-[10px] text-[var(--text-muted)] text-center">Supported: JPG, PNG, WebP</p>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold">SEO settings</h3>
               <button type="button" className="text-[var(--green)] text-xs font-bold hover:underline">Edit</button>
             </div>
             <p className="text-xs text-[var(--text-muted)] leading-relaxed">
               Preview how your post will look in search engine results.
             </p>
          </div>
        </div>
      </form>

      {/* Custom Styles for Quill */}
      <style jsx global>{`
        .quill-wrapper .ql-toolbar {
          border: none !important;
          background: var(--bg-elevated) !important;
          border-bottom: 1px solid var(--grey-dark) !important;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .quill-wrapper .ql-container {
          border: none !important;
          font-family: var(--font-pt-sans), "PT Sans", sans-serif;
          font-size: 1rem;
          color: var(--text-primary);
          height: 400px;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: var(--text-muted) !important;
          font-style: normal;
        }
        .quill-wrapper .ql-snow.ql-toolbar button {
          color: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active {
          color: var(--green) !important;
        }
        .quill-wrapper .ql-snow.ql-toolbar .ql-stroke {
          stroke: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--green) !important;
        }
        .quill-wrapper .ql-snow.ql-toolbar .ql-fill {
          fill: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: var(--green) !important;
        }
        .quill-wrapper .ql-snow .ql-picker {
          color: var(--text-secondary);
        }
        .quill-wrapper .ql-picker-label:hover {
          color: var(--green) !important;
        }
        .quill-wrapper .ql-editor img {
          max-width: 240px !important;
          height: auto !important;
          border-radius: 12px;
          border: 1px solid var(--grey-dark);
          display: block;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
