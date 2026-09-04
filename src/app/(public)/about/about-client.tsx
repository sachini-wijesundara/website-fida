"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Globe, Award, Lightbulb, Shield, Zap, Rocket } from "lucide-react";

// Values from the screenshot
const values = [
  { icon: Lightbulb, title: "Innovation First", desc: "We relentlessly pursue new ideas and technology to keep our clients ahead of the curve." },
  { icon: Shield, title: "Security at Core", desc: "Every solution we build embeds security from day one — not as a feature, but as a foundation." },
  { icon: Zap, title: "Speed & Precision", desc: "We deliver with unmatched speed without compromising on quality or reliability." },
  { icon: Globe, title: "Global Reach", desc: "Operating across 12 countries, our expertise is local and our scale is international." },
  { icon: Users, title: "People-Centric", desc: "We invest in relationships — with our clients, our partners, and our people." },
  { icon: Award, title: "Award-Winning", desc: "15+ industry awards recognise our commitment to excellence in IT service delivery." },
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

export default function AboutClient() {
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
            className="text-base md:text-lg text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: SMOOTH, delay: 0.1 }}
          >
            FIDA Global is the technology layer behind borderless workforces — covering payroll, HR, and workforce operations standard.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24 md:mb-32">
          <div></div>
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: SMOOTH }}
            className="space-y-4 text-right"
          >
            <h2 className="text-2xl md:text-[2.2rem] font-[800] text-[#052c65] leading-tight">
              Empowering workforces <br />
              to <span className="text-[#06b6d4]">thrive</span> through <br />
              intelligent technology.
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

      {/* ── 3. Team Section (Overlapping horizontal deck) ── */}
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
        <div className="flex flex-row w-full justify-between items-center relative py-4">
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
                className={`relative w-[27%] h-[160px] sm:h-[260px] md:h-[350px] rounded-[1rem] sm:rounded-[1.5rem] border-2 sm:border-[3px] border-white shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer ${
                  index > 0 ? "-ml-[2.5%]" : ""
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
        <div className="flex flex-row w-full justify-between items-center relative py-4 mt-4 sm:mt-6">
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
                className={`relative w-[27%] h-[160px] sm:h-[260px] md:h-[350px] rounded-[1rem] sm:rounded-[1.5rem] border-2 sm:border-[3px] border-white shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer ${
                  index > 0 ? "-ml-[2.5%]" : ""
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

      {/* ── 4. Award Banner Section ── */}
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
          <img src="/award.png" alt="FIDA Global Awards" loading="lazy" className="w-full h-auto object-cover" />
        </motion.div>
      </section>

      {/* ── 5. Our Values Section ── */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-[1.5rem] border border-[#052c65]/8 p-8 text-center shadow-lg shadow-blue-50/50 flex flex-col items-center gap-4 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div
                  className={`w-full max-w-[140px] py-1.5 rounded-full flex items-center justify-center border ${
                    isGreen
                      ? "bg-[#eefcf4] border-emerald-100 text-emerald-500"
                      : "bg-[#eef5fc] border-blue-100 text-blue-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#052c65] mt-1">{v.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-semibold">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Full-Spectrum IT Services Built to Scale ── */}
      <section className="pt-16 md:pt-24 pb-72 md:pb-96 container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-2"
        >
          <h2 className="text-3xl md:text-[2.35rem] font-[800] text-[#052c65] leading-tight">
            Full-Spectrum <span className="text-[#06b6d4]">IT Services</span> <br />
            Built to Scale
          </h2>
        </motion.div>

        {/* Asymmetrical staggered grid layout (7 columns / 5 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Row 1, Left Card (spans 8 columns, deep navy background) */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH }}
          >
            <div className="bg-[#0a1f44] text-white rounded-[1.75rem] p-8 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-slate-100 relative overflow-hidden group min-h-[260px]">
              <div className="space-y-4">
                <h3 className="text-lg md:text-[21px] font-bold leading-snug">
                  Consultancy for Digital Transformation
                </h3>
                <p className="text-[13px] md:text-sm text-slate-300 font-semibold leading-relaxed">
                  FIDA Global guides businesses on their digital journey — from architecture and planning to deployment and support. Our experienced consultants will work with you to understand your goals and develop a tailored roadmap.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/solutions"
                  className="bg-[#1863f2] hover:bg-[#0c50d1] text-white py-2.5 px-6 rounded-full inline-flex items-center gap-1.5 text-xs font-bold transition-all"
                >
                  SOLUTIONS <span className="text-[14px]">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Row 1, Right Card (spans 4 columns, white background) */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH, delay: 0.1 }}
          >
            <div className="bg-white border border-[#052c65]/8 rounded-[1.75rem] p-8 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-blue-50/50 hover:shadow-xl transition-all duration-300 min-h-[260px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#052c65]">Compliance Shield</h3>
                <p className="text-[13px] md:text-sm text-slate-500 font-semibold leading-relaxed">
                  Ensure regulatory compliance and data protection with our compliance services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Row 2, Left Card (spans 4 columns, light blue-grey background) */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH }}
          >
            <div className="bg-[#f0f7fc] border border-sky-100/50 rounded-[1.75rem] p-8 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-sky-50/20 hover:shadow-xl transition-all duration-300 min-h-[260px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#052c65]">Strategic Advising</h3>
                <p className="text-[13px] md:text-sm text-slate-500 font-semibold leading-relaxed">
                  Accelerate growth with our strategic advising services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Row 2, Right Card (spans 8 columns, vibrant turquoise background) */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH, delay: 0.1 }}
          >
            <div className="bg-[#48cae4] text-[#052c65] rounded-[1.75rem] p-8 md:p-10 h-full flex flex-col justify-between shadow-lg shadow-sky-100 relative overflow-hidden group min-h-[260px]">
              <div className="space-y-4">
                <h3 className="text-lg md:text-[21px] font-bold leading-snug">
                  Consultancy for Best Practice of HR
                </h3>
                <p className="text-[13px] md:text-sm text-[#052c65]/90 font-semibold leading-relaxed">
                  We assist businesses to develop tailored HR practices. We can assist you with your talent acquisition, performance management, compensation planning, and employee relations. Whether you are starting your HR function from scratch or looking to align your existing practices, our experience and proven approach can set you on the path to success.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/contact"
                  className="bg-[#0a1f44] hover:bg-[#112d62] text-white py-2.5 px-6 rounded-full inline-flex items-center gap-1.5 text-xs font-bold transition-all"
                >
                  EXPERT ADVISING <span className="text-[14px]">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
