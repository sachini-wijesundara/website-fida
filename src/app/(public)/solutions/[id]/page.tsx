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
    image: "/api/images/solutions_images/taskmanager.png"
  },
  {
    id: "access-control-attendance",
    title: "Access Control & Attendance",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    image: "/api/images/solutions_images/attendance.png"
  },
  {
    id: "helpdesk",
    title: "FIDA Helpdesk System",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    image: "/api/images/solutions_images/helpdesk.png"
  },
  {
    id: "smart-hris",
    title: "Smart HRIS",
    description: "Transform your human resources with our centralized HRIS platform, automating core HR workflows and unlocking actionable workforce insights.",
    image: "/api/images/solutions_images/smarthris.png"
  }
];

export default function SolutionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isHeroTextExpanded, setIsHeroTextExpanded] = useState(false);

  useEffect(() => {
     window.scrollTo(0, 0);
     
     async function fetchSolution() {
       try {
         const res = await fetch(`/api/solutions/${id}?t=${Date.now()}`, { cache: "no-store" });
         if (res.ok) {
           const json = await res.json();
           if (json.template_data) {
              setData({ 
                ...json.template_data, 
                order_index: json.order_index, 
                slug: json.slug,
                thumbnail_image: json.thumbnail_image,
                detail_image_1: json.detail_image_1
              });
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

      <section className="container mx-auto px-6 pt-32 max-w-6xl relative z-10">
        
        {/* Back Link */}
        <Link href="/solutions" className="inline-flex items-center gap-2 text-[#475569] hover:text-[#052c65] font-semibold text-sm mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Solutions
        </Link>

        {/* Hero Section */}
        <div className="flex flex-row flex-wrap md:flex-nowrap gap-2 md:gap-16 mb-20 md:mb-32 items-start md:items-center">
          <div className="w-[55%] md:w-1/2 pr-1 md:pr-0">
            {/* Logo */}
            <div className="mb-3 md:mb-8 flex items-center gap-6">
               <img src={data.hero?.logo_image || "/api/images/FIDA%20Global%20logos.png"} alt={`Logo`} className="max-w-[80px] md:max-w-[260px] max-h-[40px] md:max-h-[120px] w-auto h-auto object-contain object-left" />
            </div>

            <h1 className="text-[20px] leading-[1.15] md:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight mb-2 md:mb-6">
              {data.hero?.title} <br/>
              <span className="text-[#38bdf8]">{data.hero?.subtitle}</span>
            </h1>

            <div className="mb-3 md:mb-8 max-w-md">
              <p className={`text-[#475569] text-[11px] md:text-base leading-relaxed whitespace-pre-line transition-all ${isHeroTextExpanded ? '' : 'line-clamp-4 md:line-clamp-none'}`}>
                {data.hero?.description}
              </p>
              <button 
                 onClick={() => setIsHeroTextExpanded(!isHeroTextExpanded)}
                 className="text-[#3b82f6] font-bold text-[11px] mt-1 md:hidden hover:text-[#2563eb] transition-colors"
               >
                 {isHeroTextExpanded ? "Show Less" : "Read More"}
               </button>
            </div>

            <div className="flex flex-row flex-wrap lg:flex-nowrap gap-2 md:gap-2.5 lg:gap-3 mb-4 md:mb-10 overflow-hidden">
              {data.hero?.features?.map((feat: string, fidx: number) => (
                feat && (
                  <div key={fidx} className="flex items-center gap-1.5 md:gap-1.5 text-[10px] md:text-[11px] lg:text-xs font-bold text-[#052c65] whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3b82f6] shrink-0" /> 
                    <span className="leading-tight">{feat}</span>
                  </div>
                )
              ))}
            </div>

            <Link href="/contact" className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-8 md:py-4 rounded-xl bg-[#052c65] text-white font-bold text-[11px] md:text-sm hover:bg-[#167fa8] transition-colors shadow-lg w-max">
              Book a Demo <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>

          <div className="w-[43%] md:w-1/2 relative ml-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] to-[#dcfce3] rounded-2xl md:rounded-[3rem] -rotate-3 scale-105 opacity-60 blur-xl" />
            <img src={data.hero?.image || data.detail_image_1 || data.thumbnail_image || "/placeholder.jpg"} alt={`Preview`} className="relative w-full rounded-xl md:rounded-[2.5rem] shadow-2xl border border-white/50 object-cover aspect-[4/3]" />
          </div>
        </div>

        {/* Dynamic Features Section */}
        {data.features_section && data.features_section.cards && data.features_section.cards.length > 0 && (
          <div className="mb-32">
            <h2 className="text-3xl lg:text-4xl font-black text-[#052c65] text-center mb-16">
              {data.features_section.title}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-12 items-stretch relative">
              {data.features_section.cards.map((card: any, index: number) => {
                const hasImage = card.image && card.image.trim() !== "";
                if (hasImage) {
                  return (
                    <div key={index} className="col-span-2 lg:col-span-2 flex flex-row flex-wrap md:flex-nowrap gap-4 md:gap-12 items-center">
                      {index % 2 === 0 ? (
                        <>
                          <div className="w-[50%] md:w-1/2 bg-white rounded-[1.25rem] md:rounded-3xl p-5 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.2)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-bold shadow-md mb-4 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                                <span className="scale-75 md:scale-100 flex items-center justify-center">
                                  {getCardIcon(card.title, index)}
                                </span>
                             </div>
                             <h3 className="text-[13px] md:text-2xl font-bold text-[#0f172a] mb-2 md:mb-4 leading-tight">{card.title}</h3>
                             <p className="text-[#64748b] text-[10px] md:text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                          <div className="w-[45%] md:w-1/2 flex justify-center lg:justify-end ml-auto">
                             <img src={card.image} alt={card.title} className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-[45%] md:w-1/2 flex justify-center lg:justify-start">
                             <img src={card.image} alt={card.title} className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="w-[50%] md:w-1/2 bg-white rounded-[1.25rem] md:rounded-3xl p-5 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.2)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center ml-auto">
                             <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-bold shadow-md mb-4 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                                <span className="scale-75 md:scale-100 flex items-center justify-center">
                                  {getCardIcon(card.title, index)}
                                </span>
                             </div>
                             <h3 className="text-[13px] md:text-2xl font-bold text-[#0f172a] mb-2 md:mb-4 leading-tight">{card.title}</h3>
                             <p className="text-[#64748b] text-[10px] md:text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="col-span-1 bg-white rounded-[1.25rem] md:rounded-3xl p-5 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.2)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                       <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-bold shadow-md mb-4 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                          <span className="scale-75 md:scale-100 flex items-center justify-center">
                            {getCardIcon(card.title, index)}
                          </span>
                       </div>
                       <h3 className="text-[13px] md:text-2xl font-bold text-[#0f172a] mb-2 md:mb-4 leading-tight">{card.title}</h3>
                       <p className="text-[#64748b] text-[10px] md:text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}

      {/* Stat Block */}
        {data.stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="bg-[#f0f9ff]/80 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-14 shadow-[0_0_20px_rgba(56,189,248,0.25)] border-2 border-[#38bdf8] flex flex-col justify-center">
               <div className="text-5xl md:text-7xl lg:text-8xl font-black text-[#7dd3fc] tracking-tighter leading-none mb-3 md:mb-4">
                  {data.stats.percentage}
               </div>
               <h4 className="text-xs md:text-sm font-black text-[#0f172a] uppercase tracking-widest mb-4 md:mb-6 leading-relaxed">
                  {data.stats.title}
               </h4>
               <p className="text-[#475569] text-[11px] md:text-sm leading-relaxed whitespace-pre-line">
                  {data.stats.description}
               </p>
            </div>

            <div className="flex flex-col gap-4 md:gap-6 justify-center">
               <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-[inset_0_0_40px_rgba(253,224,71,0.3)] border border-[#fef08a]/50">
                  {data.stats.before_title && (
                    <h4 className="text-[13px] md:text-sm font-bold text-[#0f172a] mb-1.5 md:mb-2">{data.stats.before_title}</h4>
                  )}
                  <p className="text-[#475569] text-[11px] md:text-xs leading-relaxed font-medium whitespace-pre-line">
                    {data.stats.before_text}
                  </p>
               </div>
               <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-[inset_0_0_40px_rgba(56,189,248,0.25)] border border-[#bae6fd]/50">
                  <h4 className="text-[13px] md:text-sm font-bold text-[#0f172a] mb-1.5 md:mb-2">{data.stats.after_title || "After FIDA"}</h4>
                  <p className="text-[#475569] text-[11px] md:text-xs leading-relaxed font-medium whitespace-pre-line">
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

           <div className="w-full bg-[#2563eb] rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10 text-center md:text-left">
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">See it in action.</h2>
                 <p className="text-white/90 text-sm lg:text-lg">Get a personalized walkthrough for your team.</p>
              </div>

              <Link href="/contact" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white text-[#2563eb] font-bold text-[13px] md:text-sm hover:bg-blue-50 transition-colors shadow-lg w-full md:w-auto">
                 Book a Demo <ArrowRight size={16} />
              </Link>
           </div>
        </div>

        {/* More Solutions */}
        <div className="mb-32 lg:mb-40">
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-10">More Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MORE_SOLUTIONS.filter(sol => sol.id !== data.slug && sol.id !== id).slice(0, 3).map(sol => (
              <Link href={`/solutions/${sol.id}`} key={sol.id} className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(5,44,101,0.03)] border border-[#052c65]/5 flex flex-row md:flex-col group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)] transition-all cursor-pointer items-center md:items-stretch">
                <div className="w-[35%] md:w-full h-28 md:h-48 overflow-hidden bg-gray-100 p-1.5 md:p-2 shrink-0">
                  <img src={sol.image} alt={sol.title} className="w-full h-full object-cover rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="text-[11px] md:text-sm font-extrabold text-[#0f172a] mb-1.5 md:mb-3 uppercase tracking-tight">
                    {sol.title}
                  </h3>
                  <p className="text-[#64748b] text-[10px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-3">
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
