"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Globe, Award, Lightbulb, Shield, Zap, Rocket, Handshake } from "lucide-react";

// Values from the screenshot
const values = [
  { icon: Lightbulb, title: "Innovation First", desc: "We relentlessly pursue new ideas and technology to keep our clients ahead of the curve." },
  { icon: Shield, title: "Security at Core", desc: "We embed data protection and compliance into every layer of our platform — not bolted on, built in from day one." },
  { icon: Zap, title: "Speed & Precision", desc: "We deliver with unmatched speed without compromising on quality or reliability." },
  { icon: Globe, title: "Global Reach", desc: "Our platform operates across 4 countries, built to support enterprises with distributed, borderless teams." },
  { icon: Users, title: "People-Centric", desc: "We build technology around the people who use it — our clients, their employees, and our own team." },
  { icon: Handshake, title: "Right-Sized & Cost-Efficient", desc: "We scale up or scale down with your business — delivering exactly what you need, never paying for more than you use." },
];

// Team from the screenshot
const team = [
  // Row 1
  { name: "Upendra Wickramatunga", role: "MANAGING DIRECTOR", image: "/api/images/ourteam/upendra.png", row: 1 },
  { name: "Toshani Munasinghe", role: "DIRECTOR HCM", image: "/api/images/ourteam/toshani.png", row: 1 },
  { name: "Charmi Pallawela", role: "MANAGER BUSINESS DEVELOPMENT & OPERATION", image: "/api/images/ourteam/charmi.png", row: 1 },
  { name: "Rukshan Peiris", role: "SENIOR SOFTWARE ENGINEER", image: "/api/images/ourteam/rukshan.png", row: 1 },
  // Row 2
  { name: "Yuwanthi Perera", role: "SENIOR SOFTWARE ENGINEER", image: "/api/images/ourteam/yuwanthi.png", row: 2 },
  { name: "Gihan Nayanajith", role: "SOFTWARE ENGINEER", image: "/api/images/ourteam/gihan.png", row: 2 },
  { name: "Isuru Munasinghe", role: "MANAGER AUTOMATION AND DIGITAL TRASFORMATION", image: "/api/images/ourteam/isuru.png", row: 2 },
];

const SMOOTH: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutClient({ awardImageUrl }: { awardImageUrl: string }) {
  const row1 = team.filter(m => m.row === 1);
  const row2 = team.filter(m => m.row === 2);

  return (
    <div className="pb-36 overflow-hidden">
      
      {/* ── 1. Hero Section ── */}
      <section className="pt-48 md:pt-60 pb-2 md:pb-4 relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(186, 230, 253, 0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167, 243, 208, 0.2) 0%, transparent 70%)' }} />
        
        <div className="container mx-auto px-6 text-center max-w-4xl space-y-8 md:space-y-10 relative z-10">
          <motion.h1
            className="text-[2.65rem] md:text-[3.8rem] font-[800] text-[#052c65] tracking-tight leading-[1.08]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: SMOOTH }}
          >
            Building tomorrow&apos;s workforce, <span className="text-[#06b6d4]">today.</span>
          </motion.h1>
          
          <motion.p
            className="text-base md:text-lg text-slate-500 font-semibold max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: SMOOTH, delay: 0.1 }}
          >
            FIDA Global is the technology layer behind 370+ enterprises across 4 countries, powering payroll, HR, and workforce operations at scale.
          </motion.p>
        </div>

        {/* Expanded Large Team Banner Image aligned with max-w-5xl */}
        <div className="container mx-auto px-6 max-w-5xl relative z-10 pt-14 md:pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: SMOOTH, delay: 0.2 }}
          >
            <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-blue-50/50">
              <img
                src="/api/images/about_team_banner.png"
                alt="FIDA Global Team Collaboration"
                loading="lazy"
                className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Mission & Vision Section ── */}
      <section className="pt-4 md:pt-6 pb-16 md:pb-24 container mx-auto px-6 max-w-5xl">
        <div className="flex justify-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: SMOOTH }}
            className="text-center"
          >
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-[800] text-[#052c65] leading-tight">
              The <span className="text-[#06b6d4]">strategy</span> behind our <br />
              technology.
            </h2>
          </motion.div>
        </div>

        {/* Mission Vision Cards */}
        <div className="space-y-12">
          {/* Mission Card (Width ~60%, aligned left) */}
          <motion.div
            className="w-full md:w-[62%] mr-auto"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: SMOOTH }}
          >
            <div
              className="bg-white rounded-[1.75rem] p-8 md:p-10 border-2 border-[#bae6fd] relative overflow-hidden transition-all duration-300"
              style={{
                boxShadow: "inset 0 0 36px 8px rgba(186, 230, 253, 0.85), 0 8px 24px rgba(186, 230, 253, 0.2)",
              }}
            >
              <div className="space-y-3">
                <h3 className="text-lg md:text-[19px] font-extrabold text-[#0a2540] uppercase tracking-wider">
                  OUR MISSION
                </h3>
                <p className="text-sm md:text-[15px] font-semibold text-slate-500 leading-relaxed">
                Satisfy our customers by providing world class innovations, products and, services with Social Responsibility.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision Card (Width ~60%, aligned right) */}
          <motion.div
            className="w-full md:w-[62%] ml-auto"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: SMOOTH }}
          >
            <div
              className="bg-white rounded-[1.75rem] p-8 md:p-10 border-2 border-[#bae6fd] relative overflow-hidden text-right transition-all duration-300"
              style={{
                boxShadow: "inset 0 0 36px 8px rgba(186, 230, 253, 0.85), 0 8px 24px rgba(186, 230, 253, 0.2)",
              }}
            >
              <div className="space-y-3">
                <h3 className="text-lg md:text-[19px] font-extrabold text-[#0a2540] uppercase tracking-wider">
                  OUR VISION
                </h3>
                <p className="text-sm md:text-[15px] font-semibold text-slate-500 leading-relaxed">
                  Be a global player of providing quality life, with a better future for everybody.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Award Banner Section ── */}
      <section className="py-16 md:py-24 container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-[2.5rem] font-[800] text-[#052c65] tracking-tight mb-4">
            Award - Winning
          </h2>
          <p className="text-slate-500 font-medium md:text-lg">
            NBQSA Winner – recognised for excellence in IT service delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: SMOOTH }}
          className="w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-cyan-500/20 border-[3px] border-[#00b4d8]"
        >
          <img src={awardImageUrl || "/AWARD.JPG"} alt="FIDA Global Awards" loading="lazy" className="w-full h-auto object-cover" />
        </motion.div>
      </section>

      {/* ── 4. Our Values Section ── */}
      <section className="py-16 md:py-24 container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[22px] font-bold uppercase tracking-wider text-[#052c65]">Our Values</h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            const isGreen = i % 2 === 0;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: SMOOTH }}
                className="bg-white rounded-[1rem] md:rounded-[1.5rem] border border-[#052c65]/8 p-3 md:p-8 text-left shadow-lg shadow-blue-50/50 flex flex-col gap-2 md:gap-4 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div
                  className={`w-[95%] mx-auto h-8 md:h-12 rounded-[8px] md:rounded-[14px] flex items-center justify-center border ${
                    isGreen
                      ? "bg-[#eefcf4] border-emerald-100 text-emerald-500"
                      : "bg-[#eef5fc] border-blue-100 text-blue-500"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="mt-1 md:mt-2">
                  <h3 className="text-[10px] sm:text-[12px] md:text-base font-bold text-[#052c65] leading-tight">{v.title}</h3>
                  <p className="text-[8px] sm:text-[10px] md:text-[13px] text-slate-500 leading-snug md:leading-relaxed font-semibold mt-1">{v.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Team Section (Overlapping horizontal deck) ── */}
      <section className="py-16 md:py-24 container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-extrabold text-[#052c65] tracking-tight">
            Our <span className="text-[#06b6d4]">TEAM.</span>
          </h2>
        </motion.div>

        {/* Row 1 */}
        <div className="flex flex-row w-full justify-center items-center relative py-4">
          {row1.map((member, index) => {
            const zIndex = 10 - index;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: SMOOTH }}
                style={{ zIndex }}
                className={`relative w-[26%] h-[160px] sm:h-[260px] md:h-[350px] rounded-[1rem] sm:rounded-[1.5rem] border-2 sm:border-[3px] border-white shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer ${
                  index > 0 ? "-ml-[2%]" : ""
                }`}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent h-1/2 flex flex-col justify-end items-center text-center p-2.5 sm:p-5 text-white">
                  <span className="text-[9px] sm:text-[13px] md:text-[15px] font-[800] tracking-tight leading-tight block">
                    {member.name}
                  </span>
                  <span className="text-[7px] sm:text-[9px] md:text-[10.5px] font-bold tracking-wider opacity-85 block mt-1 uppercase">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Row 2 */}
        <div className="flex flex-row w-full justify-center items-center relative py-4 mt-4 sm:mt-6">
          {row2.map((member, index) => {
            const zIndex = 10 - index;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: SMOOTH }}
                style={{ zIndex }}
                className={`relative w-[26%] h-[160px] sm:h-[260px] md:h-[350px] rounded-[1rem] sm:rounded-[1.5rem] border-2 sm:border-[3px] border-white shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer ${
                  index > 0 ? "-ml-[2%]" : ""
                }`}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent h-1/2 flex flex-col justify-end items-center text-center p-2.5 sm:p-5 text-white">
                  <span className="text-[9px] sm:text-[13px] md:text-[15px] font-[800] tracking-tight leading-tight block">
                    {member.name}
                  </span>
                  <span className="text-[7px] sm:text-[9px] md:text-[10.5px] font-bold tracking-wider opacity-85 block mt-1 uppercase">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            );
          })} 
        </div>
      </section>

      {/* ── 5. Full-Spectrum IT Services Built to Scale ── */}
      <section className="pt-16 md:pt-24 pb-72 md:pb-96 container mx-auto px-4 sm:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16 space-y-2"
        >
          <h2 className="text-2xl md:text-[2.35rem] font-[800] text-[#052c65] leading-tight">
            Full-Spectrum <span className="text-[#06b6d4]">IT Services</span> <br />
            Built to Scale
          </h2>
        </motion.div>

        {/* Asymmetrical staggered grid layout (7 columns / 5 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-6">
          
          {/* Row 1, Left Card (spans 8 columns on desktop, 1 on mobile) */}
          <motion.div
            className="col-span-1 lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH }}
          >
            <div className="bg-[#051a3d] text-white rounded-[1rem] md:rounded-[1.75rem] p-4 sm:p-6 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-slate-100 relative overflow-hidden group min-h-[180px] md:min-h-[260px]">
              {/* Optional node graphic representation using CSS circles for background */}
              <div className="absolute -bottom-16 -right-16 opacity-30 pointer-events-none hidden md:block">
                <div className="w-64 h-64 border-[12px] border-slate-700/20 rounded-full flex items-center justify-center relative">
                   <div className="w-16 h-16 bg-slate-700/20 rounded-full absolute -top-8"></div>
                   <div className="w-16 h-16 bg-slate-700/20 rounded-full absolute -bottom-8"></div>
                   <div className="w-16 h-16 bg-slate-700/20 rounded-full absolute -left-8"></div>
                   <div className="w-16 h-16 bg-slate-700/20 rounded-full absolute -right-8"></div>
                   <div className="w-24 h-24 bg-slate-700/20 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-4 relative z-10">
                <h3 className="text-[13px] sm:text-base md:text-[21px] font-bold leading-snug">
                  Consultancy for Digital Transformation
                </h3>
                <p className="text-[9px] sm:text-[11px] md:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                  FIDA Global guides organisations through the full digital transformation journey — from strategy and system design to implementation and adoption. We help businesses replace manual processes with smart, cloud-based platforms — building a leaner, faster organisation, ready for the future.
                </p>
              </div>
              <div className="pt-4 md:pt-8 relative z-10">
                <Link
                  href="/contact"
                  className="bg-[#609af8] hover:bg-[#4b84e0] text-[#051a3d] py-1.5 px-3 md:py-3 md:px-6 rounded-full inline-flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[13px] font-bold transition-all"
                >
                  INQUIRE NOW <span className="text-[10px] md:text-[14px]">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Row 1, Right Card (spans 4 columns on desktop, 1 on mobile) */}
          <motion.div
            className="col-span-1 lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH, delay: 0.1 }}
          >
            <div className="bg-white border border-[#052c65]/8 rounded-[1rem] md:rounded-[1.75rem] p-4 sm:p-6 md:p-10 h-full flex flex-col justify-start shadow-lg shadow-blue-50/50 hover:shadow-xl transition-all duration-300 min-h-[180px] md:min-h-[260px] gap-3 md:gap-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-start text-[#609af8]">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-8 md:h-8" xmlns="http://www.w3.org/2000/svg">
                  <clipPath id="shield-clip">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </clipPath>
                  {/* Outline */}
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  {/* Quadrant Fills */}
                  <g clipPath="url(#shield-clip)">
                     <rect x="0" y="0" width="12" height="11" fill="currentColor" />
                     <rect x="12" y="11" width="12" height="13" fill="currentColor" />
                  </g>
                </svg>
              </div>
              <div className="space-y-1 md:space-y-3">
                <h3 className="text-[13px] sm:text-base md:text-[19px] font-bold text-[#609af8]">Compliance Shield</h3>
                <p className="text-[9px] sm:text-[11px] md:text-sm text-[#609af8] font-medium leading-relaxed">
                  We keep your organisation ahead of shifting labor laws. Compliance Shield monitors regulatory changes in real time, flags risk early, and keeps your HR and payroll audit-ready across every market you operate in.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Row 2, Left Card (spans 4 columns on desktop, 1 on mobile) */}
          <motion.div
            className="col-span-1 lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH }}
          >
            <div className="bg-[#f8fafc] border border-slate-100 rounded-[1rem] md:rounded-[1.75rem] p-4 sm:p-6 md:p-10 h-full flex flex-col justify-start shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 min-h-[180px] md:min-h-[260px] gap-3 md:gap-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-start text-[#052c65]">
                <Rocket className="w-5 h-5 md:w-8 md:h-8" strokeWidth={2} />
              </div>
              <div className="space-y-1 md:space-y-3">
                <h3 className="text-[13px] sm:text-base md:text-[19px] font-bold text-[#052c65]">Strategic Scaling</h3>
                <p className="text-[9px] sm:text-[11px] md:text-sm text-slate-500 font-medium leading-relaxed">
                  Growth shouldn't mean rebuilding your HR stack from scratch - and slowing down shouldn't mean carrying costs you don't need. We give you the labor logistics, compliance groundwork, and workforce infrastructure to scale up or down as your business actually requires - fast, without the usual setup delays.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Row 2, Right Card (spans 8 columns on desktop, 1 on mobile) */}
          <motion.div
            className="col-span-1 lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH, delay: 0.1 }}
          >
            <div className="bg-[#75d8de] text-[#052c65] rounded-[1rem] md:rounded-[1.75rem] p-4 sm:p-6 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-sky-100 relative overflow-hidden group min-h-[180px] md:min-h-[260px]">
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-[13px] sm:text-base md:text-[21px] font-bold leading-snug">
                  Consultancy For Best Practice of HR
                </h3>
                <p className="text-[9px] sm:text-[11px] md:text-sm text-[#052c65]/90 font-medium leading-relaxed max-w-3xl">
                  We help organisations build HR functions that are structured, fair, and genuinely effective — from recruitment and onboarding to performance management and policy development. Paired with Smart HRIS, our frameworks and expertise don't just advise best practice — they're built directly into the platform your team uses every day.
                </p>
              </div>
              <div className="pt-4 md:pt-8 flex justify-end">
                <Link
                  href="/contact"
                  className="bg-[#051a3d] hover:bg-[#030f24] text-white py-1.5 px-3 md:py-3 md:px-6 rounded-full inline-flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[13px] font-bold transition-all"
                >
                  INQUIRE NOW <span className="text-[10px] md:text-[14px]">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
