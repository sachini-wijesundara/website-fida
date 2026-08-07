"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

const MORE_SOLUTIONS = [
  {
    id: "02",
    title: "FIDA Task Manager",
    description: "Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.",
    image: "/images/solutions_images/taskmanager.png"
  },
  {
    id: "03",
    title: "Access Control & Attendance",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    image: "/images/solutions_images/attendance.png"
  },
  {
    id: "04",
    title: "FIDA Helpdesk System",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    image: "/images/solutions_images/helpdesk.png"
  }
];

const SOLUTION_DETAILS: Record<string, {
  logoPre: string;
  logoPost: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  furtherDetailsName: string;
  badge: string;
}> = {
  "01": {
    logoPre: "Smart",
    logoPost: "HRIS",
    title: "HR,",
    subtitle: "Reimagined",
    description: "A modern connected workforce platform that unifies HR and payroll into a single, automated platform — building a better way to manage your workforce with transparency and control.",
    features: ["Full HRIS capabilities", "Manager self service", "Real-time reporting"],
    image: "/images/solutions_images/smarthris.png",
    furtherDetailsName: "Smart HRIS",
    badge: "SOFTWARE SOLUTION"
  },
  "02": {
    logoPre: "Fida",
    logoPost: "Task Manager",
    title: "Workflows,",
    subtitle: "Streamlined",
    description: "Streamline project workflows with intelligent task prioritization and real-time team synchronization across your entire organization.",
    features: ["Intelligent task prioritization", "Real-time team sync", "Visual workflow tracking"],
    image: "/images/solutions_images/taskmanager.png",
    furtherDetailsName: "Fida Task Manager",
    badge: "SOFTWARE SOLUTION"
  },
  "03": {
    logoPre: "Access",
    logoPost: "Control",
    title: "Attendance,",
    subtitle: "Simplified",
    description: "Enterprise-grade biometric security and automated attendance tracking for high-traffic environments and secure facilities.",
    features: ["Biometric security integration", "Automated attendance tracking", "Secure facility control"],
    image: "/images/solutions_images/attendance.png",
    furtherDetailsName: "Access Control & Attendance",
    badge: "ACCESS CONTROL"
  },
  "04": {
    logoPre: "Fida",
    logoPost: "Helpdesk",
    title: "Support,",
    subtitle: "Reengineered",
    description: "Resolution-focused support infrastructure designed for rapid deployment and high customer satisfaction rates.",
    features: ["Rapid ticket resolution", "Resolution-focused workflows", "High customer satisfaction"],
    image: "/images/solutions_images/helpdesk.png",
    furtherDetailsName: "Fida Helpdesk System",
    badge: "SOFTWARE SOLUTION"
  },
  "05": {
    logoPre: "Fida",
    logoPost: "Consultancy",
    title: "Strategy,",
    subtitle: "Executed",
    description: "Strategic advisory and digital transformation expertise to scale your enterprise operations with precision and clarity.",
    features: ["Strategic business advisory", "Digital transformation roadmap", "Scaled enterprise operations"],
    image: "/images/solutions_images/bpo&services.png",
    furtherDetailsName: "Fida Business Consultancy",
    badge: "CONSULTANCY"
  }
};

export default function SolutionDetailPage() {
  const { id } = useParams();

  useEffect(() => {
     window.scrollTo(0, 0);
  }, []);

  // Default to Smart HRIS details if id is undefined or mismatch
  const data = SOLUTION_DETAILS[id as string] || SOLUTION_DETAILS["01"];

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
            <div className="mb-8">
               <img src="/images/FIDA%20Global%20logos.png" alt={`${data.logoPre} ${data.logoPost} Logo`} className="w-full max-w-[280px] md:max-w-[350px] lg:max-w-[400px] h-auto object-contain" />
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight mb-6 leading-tight">
              {data.title} <br/>
              <span className="text-[#38bdf8]">{data.subtitle}</span>
            </h1>

            <p className="text-[#475569] text-base leading-relaxed mb-8 max-w-md">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {data.features.map((feat, fidx) => (
                <div key={fidx} className="flex items-center gap-2 text-xs font-bold text-[#052c65]">
                  <CheckCircle2 size={16} className="text-[#3b82f6]" /> {feat}
                </div>
              ))}
            </div>

            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#052c65] text-white font-bold text-sm hover:bg-[#167fa8] transition-colors shadow-lg">
              Book a Demo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] to-[#dcfce3] rounded-[3rem] -rotate-3 scale-105 opacity-60 blur-xl" />
            <img src={data.image} alt={`${data.furtherDetailsName} Preview`} className="relative w-full rounded-[2.5rem] shadow-2xl border border-white/50 object-cover aspect-[4/3]" />
          </div>
        </div>

        {/* Built for Enterprise Efficiency */}
        <div className="mb-32">
          <h2 className="text-3xl lg:text-4xl font-black text-[#052c65] text-center mb-16">
            Built for Enterprise Efficiency
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center relative">
            
            {/* Row 1 */}
            {/* Left: Core Management Card */}
            <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
               <div className="w-12 h-12 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center font-bold shadow-md mb-8">
                  {/* Mock Icon */}
                  <div className="w-5 h-3 rounded-full border-2 border-white relative flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
               </div>
               <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Core Management</h3>
               <p className="text-[#64748b] text-sm leading-relaxed">
                 The foundation of your organization, digitized. Manage multiple companies and departments, maintain complete employee profiles, and keep every document organized and accessible.
               </p>
            </div>

            {/* Right: Man Image */}
            <div className="flex justify-center lg:justify-end">
               <img src="/images/solutions_images/smarthrispic1.png" alt="Professional using laptop" className="max-w-[90%] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Row 2 */}
            {/* Left: Woman Image */}
            <div className="flex justify-center lg:justify-start order-last lg:order-none">
               <img src="/images/solutions_images/smarthrispic2.png" alt="Dashboard preview" className="max-w-[90%] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Right: Time & Payroll Card */}
            <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
               <div className="w-12 h-12 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-bold shadow-sm mb-8">
                  {/* Mock Icon */}
                  <div className="w-5 h-4 border-2 border-[#2563eb] rounded-sm flex items-center justify-center"><div className="w-2 h-1 bg-[#2563eb]"></div></div>
               </div>
               <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Time & Payroll</h3>
               <p className="text-[#64748b] text-sm leading-relaxed">
                  Payroll that runs itself. Attendance tracking, online salary processing, loan management, and increments — accurate and on schedule, every cycle.
               </p>
            </div>

            {/* Row 3 */}
            {/* Left: Employee Experience Card */}
            <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
               <div className="w-12 h-12 rounded-xl bg-[#0d9488] text-white flex items-center justify-center font-bold shadow-md mb-8">
                  {/* Mock Icon */}
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white relative overflow-hidden"><div className="absolute bottom-0 right-0 w-3 h-3 border-t-2 border-white"></div></div>
               </div>
               <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Employee Experience</h3>
               <p className="text-[#64748b] text-sm leading-relaxed">
                  HR that employees actually engage with. A self-service portal, smart SMS/email alerts, meal tracking, benefits, and welfare deduction schemes — all in employees' hands.
               </p>
            </div>

            {/* Right: Growth, Performance & Insights Card */}
            <div className="bg-white rounded-3xl p-10 shadow-[20px_20px_40px_-10px_rgba(2,132,199,0.3)] border border-[#052c65]/5 flex flex-col group hover:-translate-y-1 transition-all h-full justify-center">
               <div className="w-12 h-12 rounded-xl bg-[#fecdd3] text-[#e11d48] flex items-center justify-center font-bold shadow-sm mb-8">
                  {/* Mock Icon */}
                  <div className="w-4 h-4 border-2 border-[#e11d48] rounded-sm relative flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#e11d48]"></div></div>
               </div>
               <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Growth, Performance & Insights</h3>
               <p className="text-[#64748b] text-sm leading-relaxed">
                  Develop your workforce and see the full picture. Performance tracking, training, recruitment, and promotions — backed by live dashboards, reports, and complete asset management.
               </p>
            </div>

          </div>
        </div>

        {/* Stat Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Big 70% Card */}
          <div className="bg-[#f0f9ff]/80 rounded-[2.5rem] p-10 lg:p-14 shadow-[0_0_20px_rgba(56,189,248,0.25)] border-2 border-[#38bdf8] flex flex-col justify-center">
             <div className="text-7xl lg:text-8xl font-black text-[#7dd3fc] tracking-tighter leading-none mb-4">
                70%
             </div>
             <h4 className="text-sm font-black text-[#0f172a] uppercase tracking-widest mb-6">
                Reduction in manual HR work
             </h4>
             <p className="text-[#475569] text-sm leading-relaxed">
                Measured across payroll, attendance, and employee-record processes — from single-department teams to multi-company enterprises.
             </p>
          </div>

          <div className="flex flex-col gap-6 justify-center">
             {/* Top right card (Yellow Glow) */}
             <div className="bg-white rounded-3xl p-8 shadow-[inset_0_0_40px_rgba(253,224,71,0.3)] border border-[#fef08a]/50">
                <p className="text-[#475569] text-xs leading-relaxed font-medium">
                  Before Smart HRIS, HR teams spent their time on manual payroll runs, paper-based leave requests, and scattered employee records — treated as a back-office cost, not a function that adds value.
                </p>
             </div>
             {/* Bottom right card (Blue Glow) */}
             <div className="bg-white rounded-3xl p-8 shadow-[inset_0_0_40px_rgba(56,189,248,0.25)] border border-[#bae6fd]/50">
                <h4 className="text-sm font-bold text-[#0f172a] mb-2">Manual HR &rarr; automated HCM.</h4>
                <p className="text-[#475569] text-xs leading-relaxed font-medium">
                  Payroll, attendance, records, and performance — now managed on one platform, with employees empowered to access their own data.
                </p>
             </div>
          </div>
        </div>

        {/* Text Line Below Stat Block */}
        <div className="flex items-center justify-center gap-2 mb-16 text-[13px]">
           <CheckCircle2 size={20} className="text-[#38bdf8]" />
           <span className="text-[#052c65] font-bold">HR shifted from cost centre to profit engine - automated, self-service, and fully in your control.</span>
        </div>

        {/* CTA Banners */}
        <div className="space-y-6 mb-32">
           <Link href="/contact" className="block w-full bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-3xl p-6 lg:p-8 flex items-center justify-center gap-4 transition-colors shadow-xl group">
             <span className="text-sm lg:text-base font-bold uppercase tracking-widest">Further Details of <span className="text-[#38bdf8]">{data.furtherDetailsName}</span></span>
             <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-[#38bdf8]" />
           </Link>

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
