"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Loader2, AlertCircle, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProject() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    categoryId: "",
    descriptionMain: "",
    descriptionChallenge: "",
    descriptionSolution: "",
    descriptionResult: "",
    imageUrl: "",
    status: "Published",
  });

  useEffect(() => {
    async function init() {
      try {
        const [catsRes, projectRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/projects/${id}`)
        ]);
        
        const catsData = await catsRes.json();
        const projectData = await projectRes.json();
        
        setCategories(catsData);
        
        if (projectData) {
          let descMain = "";
          let descChallenge = "";
          let descSolution = "";
          let descResult = "";
          
          try {
            const rawDesc = projectData.Description || projectData.description || "";
            const parsedDesc = JSON.parse(rawDesc);
            descMain = parsedDesc.main || "";
            descChallenge = parsedDesc.challenge || "";
            descSolution = parsedDesc.solution || "";
            descResult = parsedDesc.result || "";
          } catch(e) {
            // Fallback for legacy plain text descriptions
            descMain = projectData.Description || projectData.description || "";
          }

          const imageUrl = projectData.ImageUrl || projectData.image_url || "";
          setCurrentImageUrl(imageUrl);
          setFormData({
            title: projectData.Title || projectData.title || "",
            clientName: projectData.ClientName || projectData.client_name || "",
            categoryId: (projectData.CategoryId || projectData.category_id || (catsData[0]?.id))?.toString() || "",
            descriptionMain: descMain,
            descriptionChallenge: descChallenge,
            descriptionSolution: descSolution,
            descriptionResult: descResult,
            imageUrl,
            status: projectData.Status || projectData.status || "Published",
          });
        }
      } catch (err) {
        console.error("Failed to load project data:", err);
        setError("Could not load project for editing.");
      } finally {
        setFetching(false);
      }
    }
    init();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.src = ev.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
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

          const dataUrl = canvas.toDataURL('image/webp', 0.85);
          setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.descriptionMain) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
          description: JSON.stringify({
            main: formData.descriptionMain,
            challenge: formData.descriptionChallenge,
            solution: formData.descriptionSolution,
            result: formData.descriptionResult
          })
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        setError(data.error || data.message || "Failed to update project.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/projects" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Edit Project</h2>
            <p className="text-[var(--text-secondary)] mt-1">Update the details of your success story.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--blue)] to-[var(--blue-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--blue-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Saving..." : "Save Changes"}
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
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Project Title</label>
              <input 
                type="text" 
                placeholder="Ex: National Cloud Migration..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-lg font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ministry of Interior..." 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Category</label>
                  <select 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Main Description</label>
                <textarea 
                  rows={4}
                  placeholder="The Monaro digital transformation represents a benchmark in modern enterprise HR management..." 
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm resize-none"
                  value={formData.descriptionMain}
                  onChange={(e) => setFormData({...formData, descriptionMain: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">The Challenge</label>
                <textarea 
                  rows={3}
                  placeholder="Monaro faced extreme operational friction due to decentralized data silos..." 
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm resize-none"
                  value={formData.descriptionChallenge}
                  onChange={(e) => setFormData({...formData, descriptionChallenge: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">The Solution</label>
                <textarea 
                  rows={3}
                  placeholder="We implemented a custom Smart HRIS core integrated with real-time biometric tracking..." 
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm resize-none"
                  value={formData.descriptionSolution}
                  onChange={(e) => setFormData({...formData, descriptionSolution: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--text-muted)] ml-1">The Result</label>
                <textarea 
                  rows={3}
                  placeholder="Monaro reported a 45% increase in HR department efficiency..." 
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm resize-none"
                  value={formData.descriptionResult}
                  onChange={(e) => setFormData({...formData, descriptionResult: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-[var(--blue)]" />
              Featured Image
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Current image</p>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--grey-dark)] bg-[var(--bg-elevated)]/30">
                  {currentImageUrl ? (
                    <img src={currentImageUrl} alt={`Current image for ${formData.title}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
                      <ImageIcon size={28} />
                      <p className="text-xs font-medium">No current image</p>
                    </div>
                  )}
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Upload replacement</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[var(--grey-dark)] flex flex-col items-center justify-center gap-2 group hover:border-[var(--blue)] transition-smooth cursor-pointer bg-[var(--bg-elevated)]/30 overflow-hidden relative"
              >
                {formData.imageUrl && formData.imageUrl !== currentImageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="New image preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--blue)] transition-smooth">
                      <Upload size={24} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-[var(--text-secondary)]">Choose a replacement image</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Leave empty to keep the current image</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
                {["Draft", "Published"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({...formData, status: s})}
                    className={`py-3 rounded-xl text-xs font-bold transition-smooth ${formData.status === s ? 'bg-[var(--blue-glow)] text-[var(--blue)] border border-[var(--blue)]/30' : 'bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--grey-dark)] text-[var(--text-secondary)]'}`}
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
