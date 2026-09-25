"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  ArrowRight,
  Globe,
  TrendingUp,
  Cpu,
  Users,
  Briefcase,
  UserCheck,
  CheckCircle2,
  X,
  FileText,
  Mail,
  User,
  Phone,
  Send,
  Loader2,
} from "lucide-react";

const perks = [
  {
    icon: Globe,
    title: "Work Globally",
    desc: "Access projects from 15+ countries and collaborate with distributed teams in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Grow Fast",
    desc: "Structured mentorship and quarterly learning budgets to accelerate your career trajectory.",
  },
  {
    icon: Cpu,
    title: "Cutting-Edge Tech",
    desc: "Build with the latest stack, from Cloud-native architectures to AI-driven security modules.",
  },
  {
    icon: Users,
    title: "Diverse Team",
    desc: "Join a culture of inclusion where different perspectives drive our enterprise solutions.",
  },
];

const fallbackJobs = [
  {
    id: 1,
    title: "Senior Security Operations Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote / Colombo",
    is_active: true,
  },
];

export default function CareersClient() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState("All Depts");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("Open Application");
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    ResumeUrl: "",
    Message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/careers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setJobs(data.data.filter((j: any) => j.is_active));
      } else {
        setJobs(fallbackJobs);
      }
    } catch (err) {
      console.error(err);
      setJobs(fallbackJobs);
    } finally {
      setLoading(false);
    }
  };

  const openApplyModal = (position: string) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, Position: selectedPosition }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ FullName: "", Email: "", Phone: "", ResumeUrl: "", Message: "" });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Apply error", err);
      alert("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const jobDept = (job.dept || "").toLowerCase().trim();
    const jobLoc = (job.location || "").toLowerCase().trim();

    const matchesDept =
      selectedDept === "All Depts" ||
      jobDept === selectedDept.toLowerCase().trim() ||
      jobDept.includes(selectedDept.toLowerCase().trim());

    const matchesLoc =
      selectedLocation === "All Locations" ||
      (selectedLocation === "Remote" && jobLoc.includes("remote")) ||
      jobLoc === selectedLocation.toLowerCase().trim();

    return matchesDept && matchesLoc;
  });

  return (
    <div className="relative pb-36 overflow-hidden bg-white">
      {/* ── Background Atmospheric Glows matching the reference mockup ── */}
      <div
        className="absolute top-0 left-0 w-full h-[650px] pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 50rem 30rem at 5% 5%, rgba(186, 230, 253, 0.45), transparent 70%), radial-gradient(ellipse 35rem 25rem at 95% 10%, rgba(224, 242, 254, 0.35), transparent 65%)",
        }}
      />
      <div
        className="absolute top-[850px] -left-20 w-[600px] h-[600px] pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(186, 230, 253, 0.55), rgba(224, 242, 254, 0.25) 45%, transparent 70%)",
        }}
      />

      {/* ── 1. Hero Header matching the screenshot ── */}
      <section className="relative z-10 pt-36 md:pt-44 pb-10 md:pb-12 text-center max-w-4xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.15] mb-4"
        >
          Build the <span className="text-[#00a8e8]">Future</span> <br />
          of Enterprise IT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed"
        >
          We&apos;re a team of engineers, strategists, and problem-solvers united by one goal: making technology work better for businesses worldwide.
        </motion.p>
      </section>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        {/* ── 2. Wide Office Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-16"
        >
          <div className="rounded-[2rem] overflow-hidden aspect-[21/9] sm:aspect-[24/9] border border-slate-100 shadow-[0_20px_50px_rgba(5,44,101,0.06)] bg-slate-100 relative flex items-center justify-center">
            {/* Office Workspace Image */}
            <img
              src="/images/careers/office.png"
              alt="FIDA Modern Office"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If office image is missing or replaced, fallback smoothly
                e.currentTarget.src = "/api/images/about_team_banner.png";
              }}
            />
          </div>
        </motion.div>

        {/* ── 3. Four Perks Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-3xl p-7 border border-slate-100/90 shadow-[0_15px_40px_rgba(5,44,101,0.04)] hover:shadow-[0_20px_45px_rgba(0,71,225,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#e8f1fc] text-[#0047e1] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 4. Open Positions Section ── */}
        <section className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00a8e8] block">
              OPEN POSITIONS
            </span>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Role" : "Roles"} Currently Open
              </h2>

              {/* Filters capsules row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Department filter */}
                <div className="inline-flex items-center bg-[#e8f1fc] p-1 rounded-full border border-blue-100/60">
                  {["All Depts", "Engineering", "Sales"].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                        selectedDept === dept
                          ? "bg-[#0047e1] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#0047e1]"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                {/* Location filter */}
                <div className="inline-flex items-center bg-[#e8f1fc] p-1 rounded-full border border-blue-100/60">
                  {["All Locations", "Remote"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                        selectedLocation === loc
                          ? "bg-[#0047e1] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#0047e1]"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Listings */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#0047e1]">
                <Loader2 className="w-7 h-7 animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Loading Openings...
                </p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 shadow-sm space-y-2">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-[#0f172a]">No Open Roles in this Category</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your filters or send us an open application below.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(5,44,101,0.04)] hover:shadow-[0_15px_40px_rgba(0,71,225,0.08)] transition-all duration-300 p-6 sm:p-7 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                    {/* Left cyan accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#38bdf8]" />

                    <div className="flex-1 space-y-2 pl-3">
                      <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] group-hover:text-[#0047e1] transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex items-center flex-wrap gap-5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#0047e1]" />
                          {job.dept || "Engineering"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {job.type || "Full-time"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location || "Remote / Colombo"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => openApplyModal(job.title)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0047e1] hover:text-[#0037b0] transition-colors self-start sm:self-center group-hover:translate-x-1 duration-200"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* ── 5. Bottom Capsule Banner matching screenshot ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-white/95 rounded-full p-2.5 sm:p-3 px-6 sm:px-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(5,44,101,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0047e1] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Don&apos;t see a role that fits? We hire exceptional people regardless.
              </p>
            </div>

            <button
              onClick={() => openApplyModal("Open Application")}
              className="bg-[#0047e1] hover:bg-[#0037b0] text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              Send Us Your Resume
            </button>
          </motion.div>
        </section>
      </div>

      {/* ── 6. Application Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#052c65]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-slate-100 shadow-[0_25px_70px_rgba(5,44,101,0.25)] rounded-3xl w-full max-w-2xl overflow-hidden relative text-[#052c65]"
            >
              {/* Modal Header */}
              <div className="p-7 sm:p-8 pb-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0047e1]">
                    Application Form
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#052c65] mt-1">
                    Apply for <span className="text-[#0047e1]">{selectedPosition}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#052c65] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-7 sm:p-8">
                {submitSuccess ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-[#052c65]">Application Received!</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Thank you for applying to FIDA Global. Our team has received your submission and will review it shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#052c65] uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#0047e1]" />
                          <span>Full Name</span> <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.FullName}
                          onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#052c65] focus:outline-none focus:bg-white focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          placeholder="Your Full Name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#052c65] uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#0047e1]" />
                          <span>Email Address</span> <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.Email}
                          onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#052c65] focus:outline-none focus:bg-white focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#052c65] uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#0047e1]" />
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.Phone}
                          onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#052c65] focus:outline-none focus:bg-white focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          placeholder="+94 77 123 4567"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#052c65] uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#0047e1]" />
                          <span>Resume / Portfolio Link</span>
                        </label>
                        <input
                          type="url"
                          value={formData.ResumeUrl}
                          onChange={(e) => setFormData({ ...formData, ResumeUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#052c65] focus:outline-none focus:bg-white focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          placeholder="https://linkedin.com/in/... or drive link"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#052c65] uppercase tracking-wider">
                        Cover Letter / Note
                      </label>
                      <textarea
                        rows={3}
                        value={formData.Message}
                        onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#052c65] focus:outline-none focus:bg-white focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder:text-slate-400"
                        placeholder="Tell us about yourself and what you are looking for..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={submitting}
                        type="submit"
                        className="w-full bg-[#0047e1] hover:bg-[#0037b0] text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-[0_10px_25px_rgba(0,71,225,0.25)] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
