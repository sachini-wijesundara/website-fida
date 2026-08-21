"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [solutionInfo, setSolutionInfo] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    fetchSolution();
  }, [id]);

  const fetchSolution = async () => {
    try {
      const res = await fetch(`/api/solutions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSolutionInfo(data);
        setTemplate(data.template_data || {
           hero: { title: "", subtitle: "", description: "", features: [""], image: "", logo_image: null },
           features_section: { title: "", cards: [] },
           stats: { percentage: "", title: "", description: "", before_title: "", before_text: "", after_title: "", after_text: "" },
           bottom_text: ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/solutions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_data: template })
      });
      if (res.ok) {
        alert("Template saved successfully!");
        router.push("/admin/solutions");
      } else {
        alert("Failed to save template.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving template.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/admin/solutions" className="text-blue-500 hover:underline flex items-center gap-2 mb-4">
            <ArrowLeft size={16} /> Back to Solutions
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            {solutionInfo 
              ? `Edit Template: ${solutionInfo.title} (${solutionInfo.order_index ? solutionInfo.order_index.toString().padStart(2, '0') : '00'})`
              : "Edit Solution Template"}
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage the specific sections for this solution's public page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Template
        </button>
      </header>

      {/* Hero Section */}
      <section className="glass rounded-3xl p-8 border border-[var(--grey-dark)]">
        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Hero Section</h3>
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Hero Logo Upload (Optional)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                 uploadImage(file).then(url => {
                    setTemplate({...template, hero: {...template.hero, logo_image: url}});
                 }).catch(e => alert("Failed to upload logo: " + e.message));
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" 
          />
          <div className="w-full md:w-1/3 aspect-[2/1] rounded-xl overflow-hidden border border-white/10 relative bg-white/5 p-4 flex items-center justify-center">
             <img src={template.hero?.logo_image || "/api/images/FIDA%20Global%20logos.png"} alt="Logo Preview" className="w-full h-full object-contain" />
             
             <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-widest text-white">
               {template.hero?.logo_image ? "Custom Logo" : "Default Logo"}
             </div>

             {template.hero?.logo_image && (
               <button 
                 onClick={() => setTemplate({...template, hero: {...template.hero, logo_image: null}})}
                 className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                 title="Remove Custom Logo"
               >
                 <Trash2 size={14} />
               </button>
             )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Title Line 1</label>
            <input 
              value={template.hero?.title || ""} 
              onChange={e => setTemplate({...template, hero: {...template.hero, title: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Title Line 2 (Colored)</label>
            <input 
              value={template.hero?.subtitle || ""} 
              onChange={e => setTemplate({...template, hero: {...template.hero, subtitle: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
            />
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</label>
          <textarea 
            rows={3}
            value={template.hero?.description || ""} 
            onChange={e => setTemplate({...template, hero: {...template.hero, description: e.target.value}})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" 
          />
        </div>
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Bullet Points</label>
          {template.hero?.features?.map((feat: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input 
                value={feat} 
                onChange={e => {
                  const newFeat = [...(template.hero.features || [])];
                  newFeat[idx] = e.target.value;
                  setTemplate({...template, hero: {...template.hero, features: newFeat}});
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
              />
              <button onClick={() => {
                  const newFeat = [...(template.hero.features || [])];
                  newFeat.splice(idx, 1);
                  setTemplate({...template, hero: {...template.hero, features: newFeat}});
              }} className="px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><Trash2 size={16} /></button>
            </div>
          ))}
          <button onClick={() => {
              const newFeat = [...(template.hero?.features || []), ""];
              setTemplate({...template, hero: {...template.hero, features: newFeat}});
          }} className="text-blue-500 text-sm font-semibold flex items-center gap-1"><Plus size={16} /> Add Bullet</button>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Hero Image Upload</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                 uploadImage(file).then(url => {
                    setTemplate({...template, hero: {...template.hero, image: url}});
                 }).catch(e => alert("Failed to upload hero image: " + e.message));
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" 
          />
          {(template.hero?.image || solutionInfo?.thumbnail_image || solutionInfo?.detail_image_1) && (
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 relative">
               <img src={template.hero?.image || solutionInfo?.detail_image_1 || solutionInfo?.thumbnail_image} alt="Hero Preview" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Current Image</span>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="glass rounded-3xl p-8 border border-[var(--grey-dark)]">
        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Features List</h3>
        <div className="space-y-2 mb-8">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Section Title</label>
          <input 
            value={template.features_section?.title || ""} 
            onChange={e => setTemplate({...template, features_section: {...template.features_section, title: e.target.value}})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
          />
        </div>
        
        <div className="space-y-8">
          {template.features_section?.cards?.map((card: any, idx: number) => (
            <div key={idx} className="p-6 bg-black/20 rounded-2xl border border-white/5 relative">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Card {idx + 1}</h4>
                <button 
                  onClick={() => {
                    const newCards = [...template.features_section.cards];
                    newCards.splice(idx, 1);
                    setTemplate({...template, features_section: {...template.features_section, cards: newCards}});
                  }}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                  title="Remove Card"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Card Title</label>
                    <input 
                      value={card.title || ""} 
                      onChange={e => {
                        const newCards = [...template.features_section.cards];
                        newCards[idx].title = e.target.value;
                        setTemplate({...template, features_section: {...template.features_section, cards: newCards}});
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Associated Image Upload (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                           const reader = new FileReader();
                           reader.onloadend = () => {
                              const newCards = [...template.features_section.cards];
                              newCards[idx].image = reader.result as string;
                              setTemplate({...template, features_section: {...template.features_section, cards: newCards}});
                           };
                           reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" 
                    />
                    {card.image && (
                      <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 relative">
                         <img src={card.image} alt="Card Image Preview" className="w-full h-full object-contain bg-white/5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</label>
                  <textarea 
                    rows={2}
                    value={card.description || ""} 
                    onChange={e => {
                        const newCards = [...template.features_section.cards];
                        newCards[idx].description = e.target.value;
                        setTemplate({...template, features_section: {...template.features_section, cards: newCards}});
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" 
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => {
              const newCards = [...(template.features_section?.cards || [])];
              newCards.push({ title: "", description: "", iconBg: "#3b82f6", iconText: "white", image: "" });
              setTemplate({...template, features_section: {...template.features_section, cards: newCards}});
            }}
            className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-[var(--text-muted)] hover:text-white hover:border-white/50 transition-colors flex items-center justify-center gap-2 font-bold"
          >
            <Plus size={20} /> Add Card
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass rounded-3xl p-8 border border-[var(--grey-dark)]">
        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Statistics Block</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Big Percentage (e.g. 70%)</label>
            <input 
              value={template.stats?.percentage || ""} 
              onChange={e => setTemplate({...template, stats: {...template.stats, percentage: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Metric Title</label>
            <input 
              value={template.stats?.title || ""} 
              onChange={e => setTemplate({...template, stats: {...template.stats, title: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
            />
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Metric Description</label>
          <textarea 
            rows={2}
            value={template.stats?.description || ""} 
            onChange={e => setTemplate({...template, stats: {...template.stats, description: e.target.value}})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">"Before" Title</label>
               <input 
                 placeholder="e.g. Before Smart HRIS,"
                 value={template.stats?.before_title || ""} 
                 onChange={e => setTemplate({...template, stats: {...template.stats, before_title: e.target.value}})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">"Before" Text</label>
               <textarea 
                 rows={4}
                 placeholder="e.g. HR teams spent their time on manual payroll runs..."
                 value={template.stats?.before_text || ""} 
                 onChange={e => setTemplate({...template, stats: {...template.stats, before_text: e.target.value}})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" 
               />
             </div>
           </div>
           
           <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">"After" Title</label>
               <input 
                 placeholder="e.g. Manual HR -> automated HCM."
                 value={template.stats?.after_title || ""} 
                 onChange={e => setTemplate({...template, stats: {...template.stats, after_title: e.target.value}})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">"After" Text</label>
               <textarea 
                 rows={4}
                 placeholder="e.g. Payroll, attendance, records, and performance now managed..."
                 value={template.stats?.after_text || ""} 
                 onChange={e => setTemplate({...template, stats: {...template.stats, after_text: e.target.value}})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none" 
               />
             </div>
           </div>
        </div>
      </section>

      {/* Footer Line */}
      <section className="glass rounded-3xl p-8 border border-[var(--grey-dark)]">
        <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Footer Highlight</h3>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Bottom Text</label>
          <input 
            value={template.bottom_text || ""} 
            onChange={e => setTemplate({...template, bottom_text: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" 
          />
        </div>
      </section>
    </div>
  );
}
