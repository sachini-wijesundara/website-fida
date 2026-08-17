"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Eye,
  Ticket,
  TrendingUp,
  MessageSquare,
  Shield
} from "lucide-react";

function getCardIcon(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes("access control") || t.includes("transparency")) {
    return <Eye size={20} />;
  }
  if (t.includes("payroll") || t.includes("ticketing") || t.includes("attendance")) {
    return <Ticket size={20} />;
  }
  if (t.includes("patrol") || t.includes("monitoring") || t.includes("progress") || t.includes("insights")) {
    return <TrendingUp size={20} />;
  }
  if (t.includes("facility") || t.includes("collaboration") || t.includes("experience") || t.includes("performance")) {
    return <MessageSquare size={20} />;
  }
  if (t.includes("core")) {
    return <Shield size={20} />;
  }

  // Fallback by index
  switch (index % 4) {
    case 0: return <Eye size={20} />;
    case 1: return <Ticket size={20} />;
    case 2: return <TrendingUp size={20} />;
    case 3: return <MessageSquare size={20} />;
    default: return <Eye size={20} />;
  }
}

const MORE_SOLUTIONS = [
  {
    id: "task-manager",
    title: "FIDA Task Manager",
    description: "Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.",
    image: "/images/solutions_images/taskmanager.png"
  },
  {
    id: "access-control-attendance",
    title: "Access Control & Attendance",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    image: "/images/solutions_images/attendance.png"
  },
  {
    id: "helpdesk",
    title: "FIDA Helpdesk System",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    image: "/images/solutions_images/helpdesk.png"
  }
];

export default function SolutionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
     window.scrollTo(0, 0);
     
     async function fetchSolution() {
       try {
         const res = await fetch(`/api/solutions/${id}?t=${Date.now()}`, { cache: "no-store" });
         if (res.ok) {
           const json = await res.json();
           if (json.template_data) {
              setData({ ...json.template_data, order_index: json.order_index, slug: json.slug });
           } else {
              console.warn("No template_data found, redirecting");
              router.push("/solutions");
           }
         } else {
           console.error("API returned not ok:", res.status, res.statusText);
           const errText = await res.text();
           console.error("API Error details:", errText);
           router.push("/solutions");
         }
       } catch (err) {
         console.error("Fetch threw an error:", err);
         router.push("/solutions");
       } finally {
         setLoading(false);
       }
     }
     
     if (id) fetchSolution();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafcff]">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen relative bg-[#fafcff] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#e0f7fa] to-transparent opacity-50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[800px] h-[800px] bg-gradient-to-tr from-[#e0f7fa] to-transparent opacity-40 rounded-full blur-3xl -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#fee2e2] to-transparent opacity-30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <section className="container mx-auto px-6 pt-32 pb-[350px] max-w-6xl relative z-10">
        
        {/* Back Link */}
        <Link href="/solutions" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#052c65] font-semibold text-sm mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Solutions
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <div>
            {/* Logo */}
            <div className="mb-8 flex items-center gap-6">
               <img src={data.hero?.logo_image || "/images/FIDA%20Global%20logos.png"} alt={`Logo`} className="w-full max-w-[280px] md:max-w-[300px] h-auto object-contain" />
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight mb-6 leading-tight">
              {data.hero?.title} <br/>
              <span className="text-[#38bdf8]">{data.hero?.subtitle}</span>
            </h1>

            <p className="text-[#475569] text-base leading-relaxed mb-8 max-w-md whitespace-pre-line">
              {data.hero?.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {data.hero?.features?.map((feat: string, fidx: number) => (
                feat && (
                  <div key={fidx} className="flex items-center gap-2 text-xs font-bold text-[#052c65]">
                    <CheckCircle2 size={16} className="text-[#3b82f6]" /> {feat}
                  </div>
                )
              ))}
            </div>

            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#052c65] text-white font-bold text-sm hover:bg-[#167fa8] transition-colors shadow-lg">
              Book a Demo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] to-[#dcfce3] rounded-[3rem] -rotate-3 scale-105 opacity-60 blur-xl" />
            <img src={data.hero?.image} alt={`Preview`} className="relative w-full rounded-[2.5rem] shadow-2xl border border-white/50 object-cover aspect-[4/3]" />
          </div>
        </div>

        {/* Dynamic Features Section */}
        {data.features_section && data.features_section.cards && data.features_section.cards.length > 0 && (
          <div className="mb-32">
            <h2 className="text-3xl lg:text-4xl font-black text-[#052c65] text-center mb-16">
              {data.features_section.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-stretch relative">
              {data.features_section.cards.map((card: any, index: number) => {
                const hasImage = card.image && card.image.trim() !== "";
                if (hasImage) {
                  return (
                    <div key={index} className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {index % 2 === 0 ? (
                        <>
                          <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                             <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-8" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                                {getCardIcon(card.title, index)}
                             </div>
                             <h3 className="text-2xl font-bold text-[#0f172a] mb-4">{card.title}</h3>
                             <p className="text-[#64748b] text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                          <div className="flex justify-center lg:justify-end">
                             <img src={card.image} alt={card.title} className="max-w-[90%] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-center lg:justify-start order-last lg:order-none">
                             <img src={card.image} alt={card.title} className="max-w-[90%] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                             <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-8" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                                {getCardIcon(card.title, index)}
                             </div>
                             <h3 className="text-2xl font-bold text-[#0f172a] mb-4">{card.title}</h3>
                             <p className="text-[#64748b] text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="col-span-1 bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-8" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                          {getCardIcon(card.title, index)}
                       </div>
                       <h3 className="text-2xl font-bold text-[#0f172a] mb-4">{card.title}</h3>
                       <p className="text-[#64748b] text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}

        {/* Stat Block */}
        {data.stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#f0f9ff]/80 rounded-[2.5rem] p-10 lg:p-14 shadow-[0_0_20px_rgba(56,189,248,0.25)] border-2 border-[#38bdf8] flex flex-col justify-center">
               <div className="text-7xl lg:text-8xl font-black text-[#7dd3fc] tracking-tighter leading-none mb-4">
                  {data.stats.percentage}
               </div>
               <h4 className="text-sm font-black text-[#0f172a] uppercase tracking-widest mb-6">
                  {data.stats.title}
               </h4>
               <p className="text-[#475569] text-sm leading-relaxed whitespace-pre-line">
                  {data.stats.description}
               </p>
            </div>

            <div className="flex flex-col gap-6 justify-center">
               <div className="bg-white rounded-3xl p-8 shadow-[inset_0_0_40px_rgba(253,224,71,0.3)] border border-[#fef08a]/50">
                  <p className="text-[#475569] text-xs leading-relaxed font-medium whitespace-pre-line">
                    {data.stats.before_text}
                  </p>
               </div>
               <div className="bg-white rounded-3xl p-8 shadow-[inset_0_0_40px_rgba(56,189,248,0.25)] border border-[#bae6fd]/50">
                  <h4 className="text-sm font-bold text-[#0f172a] mb-2">After FIDA</h4>
                  <p className="text-[#475569] text-xs leading-relaxed font-medium whitespace-pre-line">
                    {data.stats.after_text}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Text Line Below Stat Block */}
        {data.bottom_text && (
          <div className="flex items-center justify-center gap-2 mb-16 text-[13px]">
             <CheckCircle2 size={20} className="text-[#38bdf8]" />
             <span className="text-[#052c65] font-bold">{data.bottom_text}</span>
          </div>
        )}

        {/* CTA Banners */}
        <div className="space-y-6 mb-32">
           {data.slug === "smart-hris" && (
             <Link href="https://smarthris.com" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-3xl p-6 lg:p-8 flex items-center justify-center gap-4 transition-colors shadow-xl group">
               <span className="text-sm lg:text-base font-bold uppercase tracking-widest">Further Details of <span className="text-[#38bdf8]">Smart HRIS</span></span>
               <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-[#38bdf8]" />
             </Link>
           )}

           <div className="w-full bg-[#2563eb] rounded-3xl p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                 <h2 className="text-3xl lg:text-4xl font-black text-white mb-2">See it in action.</h2>
                 <p className="text-white text-base lg:text-lg">Get a personalized walkthrough for your team.</p>
              </div>

              <Link href="/contact" className="relative z-10 shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2563eb] font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
                 Book a Demo <ArrowRight size={16} />
              </Link>
           </div>
        </div>

        {/* More Solutions */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-10">More Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MORE_SOLUTIONS.map(sol => (
              <Link href={`/solutions/${sol.id}`} key={sol.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(5,44,101,0.03)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)] transition-all cursor-pointer">
                <div className="h-48 overflow-hidden bg-gray-100 p-2">
                  <img src={sol.image} alt={sol.title} className="w-full h-full object-cover rounded-2xl transition-all duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-sm font-extrabold text-[#0f172a] mb-3 uppercase tracking-tight">
                    {sol.title}
                  </h3>
                  <p className="text-[#64748b] text-xs leading-relaxed line-clamp-3">
                    {sol.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
