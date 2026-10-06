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
  Shield,
  AlertCircle
} from "lucide-react";

const UPPERCASE_WORDS = new Set(["crm", "hris", "fida", "hrms", "erp", "ai", "hr"]);

function formatSlugName(slug: string): string {
  return slug
    .split('-')
    .map((w) => UPPERCASE_WORDS.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

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

interface SolutionDetailClientProps {
  id: string;
  initialData?: any;
}

export default function SolutionDetailClient({ id, initialData }: SolutionDetailClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!initialData);
  const [data, setData] = useState<any>(initialData || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHeroTextExpanded, setIsHeroTextExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // If initialData was already provided via SSR, do not fetch again
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchSolution(retries = 2) {
      try {
        const res = await fetch(`/api/solutions/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.template_data && isMounted) {
            setData({ 
              ...json.template_data, 
              order_index: json.order_index, 
              slug: json.slug,
              thumbnail_image: json.thumbnail_image,
              detail_image_1: json.detail_image_1
            });
            setLoading(false);
          } else if (isMounted) {
            setErrorMsg(`No template data found for solution: ${id}.`);
            setLoading(false);
          }
        } else {
          if (retries > 0 && isMounted) {
            setTimeout(() => fetchSolution(retries - 1), 1000);
            return;
          }
          if (isMounted) {
            setErrorMsg(`Failed to load solution (${res.status}).`);
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (retries > 0 && isMounted) {
          setTimeout(() => fetchSolution(retries - 1), 1000);
          return;
        }
        if (isMounted) {
          setErrorMsg(`Network or parsing error: ${err.message}`);
          setLoading(false);
        }
      }
    }

    if (id) fetchSolution();
    return () => { isMounted = false; };
  }, [id, initialData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafcff]">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-6">{errorMsg}</p>
          <button 
            onClick={() => router.push("/solutions")}
            className="px-6 py-3 bg-[#052c65] text-white rounded-xl font-bold hover:bg-[#167fa8] transition-colors"
          >
            Back to Solutions
          </button>
        </div>
      </main>
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
        <div className="mb-20 md:mb-32 w-full"> 

          {/* ── MOBILE layout ── */}
          <div className="md:hidden">
            {/* Logo — full width */}
            <div className="mb-3 flex items-center">
              <img src={data.hero?.logo_image || "/api/images/FIDA%20Global%20logos.png"} alt="Logo" className="max-w-[90px] max-h-[40px] w-auto h-auto object-contain object-left" loading="eager" fetchPriority="high" />
            </div>

            {/* Title + Image — side by side */}
            <div className="flex flex-row gap-3 items-center mb-4">
              <h1 className="flex-1 text-[17px] leading-[1.2] font-black text-[#0f172a] tracking-tight">
                {data.hero?.title}<br/>
                <span className="text-[#38bdf8]">{data.hero?.subtitle}</span>
              </h1>
              <div className="w-[42%] shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] to-[#dcfce3] rounded-2xl -rotate-3 scale-105 opacity-60 blur-xl" />
                <img
                  src={data.hero?.image || data.detail_image_1 || data.thumbnail_image || "/placeholder.jpg"}
                  alt="Preview"
                  className="relative w-full rounded-2xl shadow-2xl border border-white/50 object-cover aspect-square" loading="eager" fetchPriority="high"
                />
              </div>
            </div>

            {/* Description + Read More */}
            <div className="mb-4">
              <p className={`text-[#475569] text-[12px] leading-relaxed whitespace-pre-line transition-all ${isHeroTextExpanded ? '' : 'line-clamp-4'}`}>
                {data.hero?.description}
              </p>
              <button
                onClick={() => setIsHeroTextExpanded(!isHeroTextExpanded)}
                className="text-[#3b82f6] font-bold text-[12px] mt-1 hover:text-[#2563eb] transition-colors"
              >
                {isHeroTextExpanded ? "Show Less" : "Read More"}
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2 mb-5">
              {data.hero?.features?.map((feat: string, fidx: number) => (
                feat && (
                  <div key={fidx} className="flex items-center gap-2 text-[12px] font-bold text-[#052c65]">
                    <CheckCircle2 className="w-4 h-4 text-[#3b82f6] shrink-0" />
                    <span>{feat}</span>
                  </div>
                )
              ))}
            </div>

            {/* Book a Demo button */}
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#052c65] text-white font-bold text-[12px] hover:bg-[#167fa8] transition-colors shadow-lg w-max">
              Book a Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── DESKTOP layout ── */}
          <div className="hidden md:flex flex-row gap-16 items-center justify-between w-full">
            {/* Text column */}
            <div className="w-1/2 min-w-0 flex flex-col justify-start">
              <div className="mb-8 flex items-center gap-6">
                <img src={data.hero?.logo_image || "/api/images/FIDA%20Global%20logos.png"} alt="Logo" className="max-w-[260px] max-h-[120px] w-auto h-auto object-contain object-left" loading="eager" fetchPriority="high" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight mb-6 mt-0">
                {data.hero?.title} <br/>
                <span className="text-[#38bdf8]">{data.hero?.subtitle}</span>
              </h1>
              <div className="mb-8 max-w-md">
                <p className="text-[#475569] text-base leading-relaxed whitespace-pre-line">
                  {data.hero?.description}
                </p>
              </div>
              <div className="flex flex-row flex-wrap lg:flex-nowrap gap-2.5 lg:gap-3 mb-10 overflow-hidden">
                {data.hero?.features?.map((feat: string, fidx: number) => (
                  feat && (
                    <div key={fidx} className="flex items-center gap-1.5 text-[11px] lg:text-xs font-bold text-[#052c65] whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  )
                ))}
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#052c65] text-white font-bold text-sm hover:bg-[#167fa8] transition-colors shadow-lg w-max">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Image column */}
            <div className="w-1/2 relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] to-[#dcfce3] rounded-[3rem] -rotate-3 scale-105 opacity-60 blur-xl" />
              <img src={data.hero?.image || data.detail_image_1 || data.thumbnail_image || "/placeholder.jpg"} alt="Preview" className="relative w-full rounded-[2.5rem] shadow-2xl border border-white/50 object-cover aspect-[4/3]" loading="eager" fetchPriority="high" />
            </div>
          </div>

        </div>

        {/* Dynamic Features Section */}
        {data.features_section && data.features_section.cards && data.features_section.cards.length > 0 && (
          <div className="mb-20 md:mb-32">
            <h2 className="text-xl md:text-4xl font-black text-[#052c65] text-center mb-8 md:mb-16 px-2">
              {data.features_section.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 lg:gap-12 items-stretch relative">
              {data.features_section.cards.map((card: any, index: number) => {
                const hasImage = card.image && card.image.trim() !== "";
                if (hasImage) {
                  return (
                    <div key={index} className="col-span-2 flex flex-row gap-4 md:gap-12 items-center">
                      {index % 2 === 0 ? (
                        <>
                          <div className="w-1/2 bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.15)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.2)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all justify-center min-h-[160px] md:h-full">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-3 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                              <span className="scale-90 md:scale-100 flex items-center justify-center">
                                {getCardIcon(card.title, index)}
                              </span>
                            </div>
                            <h3 className="text-sm md:text-2xl font-bold text-[#0f172a] mb-1.5 md:mb-4 leading-tight">{card.title}</h3>
                            <p className="text-[#64748b] text-[11px] md:text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                          <div className="w-1/2 flex justify-center">
                            <img src={card.image} alt={card.title} className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 max-h-[200px] md:max-h-none" loading="lazy" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-1/2 flex justify-center">
                            <img src={card.image} alt={card.title} className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 max-h-[200px] md:max-h-none" loading="lazy" />
                          </div>
                          <div className="w-1/2 bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.15)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.2)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all justify-center min-h-[160px] md:h-full">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-3 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                              <span className="scale-90 md:scale-100 flex items-center justify-center">
                                {getCardIcon(card.title, index)}
                              </span>
                            </div>
                            <h3 className="text-sm md:text-2xl font-bold text-[#0f172a] mb-1.5 md:mb-4 leading-tight">{card.title}</h3>
                            <p className="text-[#64748b] text-[11px] md:text-sm leading-relaxed whitespace-pre-line">{card.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="col-span-1 bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-[10px_10px_30px_-10px_rgba(2,132,199,0.15)] md:shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.2)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold shadow-md mb-3 md:mb-8 shrink-0" style={{ backgroundColor: card.iconBg || '#3b82f6', color: card.iconText || 'white' }}>
                        <span className="scale-90 md:scale-100 flex items-center justify-center">
                          {getCardIcon(card.title, index)}
                        </span>
                      </div>
                      <h3 className="text-[12px] md:text-xl font-bold text-[#0f172a] mb-1.5 md:mb-4 leading-tight">{card.title}</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8 items-stretch">
            {/* Big stat card — left, wider */}
            <div className="md:col-span-7 bg-[#f0f9ff]/80 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-14 shadow-[0_0_20px_rgba(56,189,248,0.25)] border-2 border-[#38bdf8] flex flex-col justify-center">
              <div className="text-5xl md:text-7xl lg:text-8xl font-black text-[#7dd3fc] tracking-tighter leading-none mb-3 md:mb-4">
                {data.stats.percentage}
              </div>
              <h4 className="text-xs md:text-sm font-black text-[#0f172a] uppercase tracking-widest mb-4 md:mb-6 leading-relaxed">
                {data.stats.title}
              </h4>
              <p className="text-[#475569] text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {data.stats.description}
              </p>
            </div>

            {/* Before / After cards — right, stacked vertically */}
            <div className="md:col-span-5 grid grid-cols-1 gap-3 md:gap-4 h-full">
              <div className="h-full bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-[inset_0_0_40px_rgba(253,224,71,0.3)] border border-[#fef08a]/50 flex flex-col justify-center">
                <h4 className="text-[11px] md:text-sm font-bold text-[#0f172a] mb-1.5 md:mb-2">
                  Before {formatSlugName(data.slug as string ?? '')}
                </h4>
                <p className="text-[#475569] text-[10px] md:text-xs leading-relaxed font-medium whitespace-pre-line">
                  {data.stats.before_text}
                </p>
              </div>
              <div className="h-full bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-[inset_0_0_40px_rgba(56,189,248,0.25)] border border-[#bae6fd]/50 flex flex-col justify-center">
                <h4 className="text-[11px] md:text-sm font-bold text-[#0f172a] mb-1.5 md:mb-2">
                  After {formatSlugName(data.slug as string ?? '')}
                </h4>
                <p className="text-[#475569] text-[10px] md:text-xs leading-relaxed font-medium whitespace-pre-line">
                  {data.stats.after_text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Text Line Below Stat Block */}
        {(data.bottom_text || (data.slug === 'smart-hris' ? "HR shifted from cost centre to profit engine - automated, self-service, and fully in your control." : null)) && (
          <div className="flex items-start justify-center gap-2 mb-16 px-4 md:px-0 text-[10px] md:text-[13px] max-w-[90%] md:max-w-none mx-auto">
            <CheckCircle2 className="text-[#38bdf8] shrink-0 w-4 h-4 md:w-5 md:h-5 mt-[2px] md:mt-0 md:self-center" />
            <span className="text-[#052c65] font-bold text-left">
              {data.bottom_text || (data.slug === 'smart-hris' ? "HR shifted from cost centre to profit engine - automated, self-service, and fully in your control." : null)}
            </span>
          </div>
        )}

        {/* Further Details Button for Smart HRIS */}
        {(data.slug === "smart-hris" || id === "smart-hris") && (
          <div className="mb-12 lg:mb-16">
            <Link href="https://smarthris.com" target="_blank" rel="noopener noreferrer" className="block w-full bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 flex items-center justify-center gap-4 transition-all shadow-xl hover:shadow-2xl group">
              <span className="text-xs sm:text-sm lg:text-base font-bold uppercase tracking-widest text-center">
                Further Details of <span className="text-[#38bdf8]">Smart HRIS</span>
              </span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-[#38bdf8] shrink-0" />
            </Link>
          </div>
        )}
      </section>

      {/* Smart HRIS Extended Showcase */}
      {(data.slug === "smart-hris" || id === "smart-hris") && (
        <section className="w-full relative z-10 overflow-hidden space-y-16 md:space-y-24 lg:space-y-32 mb-16 lg:mb-24">
          <div className="container mx-auto px-6 max-w-6xl flex justify-center items-center">
            <div className="relative w-full max-w-4xl px-2">
              <img
                src="/HRIS%20lap.png"
                alt="Smart HRIS Dashboard on Laptop"
                className="w-full h-auto object-contain mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-transform duration-700 hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="w-full flex flex-row items-center justify-between gap-2 sm:gap-6 lg:gap-12">
            <div className="w-[46%] sm:w-1/2 flex justify-start items-center pl-0 shrink-0">
              <img
                src="/new%20HRIS%20tab.png"
                alt="Smart HRIS on Tablet"
                className="w-full max-w-[220px] xs:max-w-[270px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[760px] xl:max-w-[840px] h-auto object-contain object-left drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:scale-[1.01]"
                loading="lazy"
              />
            </div>

            <div className="w-[54%] sm:w-1/2 pr-2 sm:pr-8 lg:pr-16 xl:pr-28 pl-1 sm:pl-0 flex justify-center lg:justify-start">
              <div className="w-full max-w-xl bg-white/95 rounded-2xl sm:rounded-[28px] md:rounded-[32px] p-2.5 xs:p-3 sm:p-6 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(5,44,101,0.06)] border border-slate-100 relative overflow-hidden">
                <h3 className="text-[10px] xs:text-xs sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0f172a] mb-1 sm:mb-3 md:mb-5 tracking-tight leading-snug">
                  One dashboard. Every HR metric that matters.
                </h3>
                <div className="space-y-1 sm:space-y-2.5 md:space-y-4 text-slate-600 text-[7.5px] xs:text-[9px] sm:text-xs md:text-sm lg:text-[15px] leading-tight sm:leading-relaxed">
                  <p>
                    Smart HRIS brings all your workforce data into a single, real-time dashboard — accessible seamlessly across laptop and tablet.
                  </p>
                  <p>
                    Headcount, diversity, turnover, attendance, and job category breakdowns are visible the moment you log in, on whichever screen you&apos;re using.
                  </p>
                  <p>
                    No more pulling reports from five systems — just instant, accurate insight into how your organisation is performing, wherever you&apos;re working from.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row items-center justify-between gap-2 sm:gap-6 lg:gap-12">
            <div className="w-[54%] sm:w-1/2 pl-2 sm:pl-8 lg:pl-16 xl:pr-28 pr-1 sm:pr-0 flex justify-center lg:justify-end">
              <div className="w-full max-w-xl bg-white/95 rounded-2xl sm:rounded-[28px] md:rounded-[32px] p-2.5 xs:p-3 sm:p-6 md:p-10 lg:p-12 shadow-[0_4px_20px_rgba(5,44,101,0.06)] border border-slate-100 relative overflow-hidden">
                <h3 className="text-[10px] xs:text-xs sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0f172a] mb-1 sm:mb-3 md:mb-5 tracking-tight leading-snug">
                  HR that fits in your employees&apos; pocket.
                </h3>
                <div className="space-y-1 sm:space-y-2.5 md:space-y-4 text-slate-600 text-[7.5px] xs:text-[9px] sm:text-xs md:text-sm lg:text-[15px] leading-tight sm:leading-relaxed">
                  <p>
                    The Self Service Portal gives every employee their own personal dashboard — accessible right from their phone.
                  </p>
                  <p>
                    From there, they can check their leave balance, submit requests, view payslips, update personal information, and track their own attendance, without ever needing to email HR or wait for a reply. It&apos;s designed to reduce the constant back-and-forth that eats up HR&apos;s time on routine requests, while giving employees the independence and transparency they expect from a modern workplace.
                  </p>
                  <p>
                    Simple, accessible, and available whenever they are.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[46%] sm:w-1/2 flex justify-end items-center pr-0 shrink-0">
              <img
                src="/new%20HRIS%20mobile.png"
                alt="Smart HRIS Mobile App"
                className="w-full max-w-[190px] xs:max-w-[230px] sm:max-w-[400px] md:max-w-[520px] lg:max-w-[640px] xl:max-w-[700px] h-auto object-contain object-right drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="container mx-auto px-6 max-w-6xl">
            <div className="relative w-full rounded-[24px] md:rounded-[36px] overflow-hidden shadow-[0_16px_50px_rgba(5,44,101,0.08)] border border-slate-200/90 bg-white">
              <video
                src="/Introducing.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-auto block rounded-[24px] md:rounded-[36px]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA & More Solutions Section */}
      <section className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="w-full bg-[#2563eb] rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl overflow-hidden relative mb-28 lg:mb-36">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">See it in action.</h2>
            <p className="text-white/90 text-sm lg:text-lg">Get a personalized walkthrough for your team.</p>
          </div>

          <Link href="/contact" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white text-[#2563eb] font-bold text-[13px] md:text-sm hover:bg-blue-50 transition-colors shadow-lg w-full md:w-auto">
            Book a Demo <ArrowRight size={16} />
          </Link>
        </div>

        {/* More Solutions */}
        <div className="mb-32 lg:mb-40">
          <h2 className="text-3xl font-extrabold text-[#0f172a] mb-10">More Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MORE_SOLUTIONS.filter(sol => sol.id !== data.slug && sol.id !== id).slice(0, 3).map(sol => (
              <Link href={`/solutions/${sol.id}`} key={sol.id} className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(5,44,101,0.03)] border border-[#052c65]/5 flex flex-row md:flex-col group hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,44,101,0.06)] transition-all cursor-pointer items-center md:items-stretch">
                <div className="w-[35%] md:w-full h-28 md:h-48 overflow-hidden bg-gray-100 p-1.5 md:p-2 shrink-0">
                  <img src={sol.image} alt={sol.title} className="w-full h-full object-cover rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-105" loading="lazy" />
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
