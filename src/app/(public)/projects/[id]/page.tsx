"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [data, setData] = React.useState<any>(null);
  const [moreStudies, setMoreStudies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
     window.scrollTo(0, 0);
     
     async function loadProject() {
       try {
         const projectRes = await fetch(`/api/projects/${id}`);
         
         if (projectRes.ok) {
           const project = await projectRes.json();
           let descMain = "";
           let challenge = "";
           let solution = "";
           let result = "";
           
           try {
             const parsed = JSON.parse(project.Description || project.description || "{}");
             descMain = parsed.main || "";
             challenge = parsed.challenge || "";
             solution = parsed.solution || "";
             result = parsed.result || "";
           } catch(e) {
             descMain = project.Description || project.description || "";
           }

           setData({
             title: project.Title || project.title,
             category: project.CategoryName || project.category_name,
             image: project.ImageUrl || project.image_url,
             descriptionMain: descMain,
             challenge,
             solution,
             result
           });
         }
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
     }

     async function loadMoreStudies() {
       try {
         const response = await fetch(`/api/projects?summary=true`);
         if (!response.ok) return;
         const all = await response.json();
         setMoreStudies(all.filter((p: any) => String(p.id) !== String(id)).slice(0, 3));
       } catch (err) {
         console.error(err);
       }
     }
     
     loadProject();
     loadMoreStudies();
  }, [id]);

  if (loading) {
    return (
      <main className="public-pastel-page min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#052c65]"></div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="public-pastel-page min-h-screen flex items-center justify-center">
        <p className="text-[#475569] font-bold">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="public-pastel-page min-h-screen">
      <section className="container mx-auto px-6 pt-32  max-w-6xl">
        
        {/* Back Link */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#052c65] font-semibold text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#e0f2fe] text-[#0284c7]">
                {data.category || "Project"}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#94a3b8]" />
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                Case Study
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-[#052c65] uppercase tracking-tighter mb-10 leading-tight">
              {data.title}
            </h1>

            <div className="space-y-6 text-[0.95rem] text-[#475569] leading-relaxed whitespace-pre-wrap">
              <p>{data.descriptionMain}</p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#052c65]/5 aspect-[4/3]">
            {data.image ? (
              <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Image Provided</span>
              </div>
            )}
          </div>
        </div>

        {/* Challenge / Solution / Result */}
        {(data.challenge || data.solution || data.result) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            {data.challenge && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Challenge</h3>
                <p className="text-[#64748b] text-[0.85rem] leading-relaxed whitespace-pre-wrap">
                  {data.challenge}
                </p>
              </div>
            )}
            {data.solution && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Solution</h3>
                <p className="text-[#64748b] text-[0.85rem] leading-relaxed whitespace-pre-wrap">
                  {data.solution}
                </p>
              </div>
            )}
            {data.result && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#3b82f6] uppercase tracking-widest">The Result</h3>
                <p className="text-[#64748b] text-[0.85rem] leading-relaxed whitespace-pre-wrap">
                  {data.result}
                </p>
              </div>
            )}
          </div>
        )}

        {/* More Case Studies */}
        {moreStudies.length > 0 && (
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f172a] mb-10">More Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {moreStudies.map(study => (
                <Link href={`/projects/${study.id}`} key={study.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(5,44,101,0.03)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)] transition-all cursor-pointer">
                  <div className="h-48 overflow-hidden bg-gray-100 p-2">
                    {study.image_url ? (
                      <img src={study.image_url} alt={study.title} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 rounded-2xl" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-2">
                      {study.category_name || "Project"}
                    </div>
                    <h3 className="text-base font-extrabold text-[#0f172a] mb-3">
                      {study.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Spacer to push footer down and create gap */}
        <div className="h-[250px] lg:h-[350px] w-full" aria-hidden="true" />
      </section>
    </main>
  );
}
