"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowUpRight, Zap, Globe, Users, TrendingUp, Loader2 } from "lucide-react";

const perks = [
  { icon: Globe, color: "var(--green)", title: "Work Globally", desc: "Remote-first with offices in 12 countries. Work where you thrive." },
  { icon: TrendingUp, color: "var(--blue)", title: "Grow Fast", desc: "Structured career paths, mentorship, and a learning budget for every employee." },
  { icon: Zap, color: "var(--green)", title: "Cutting-Edge Tech", desc: "Work on enterprise problems at scale using the latest AI, cloud, and security tools." },
  { icon: Users, color: "var(--grey-light)", title: "Diverse Team", desc: "40+ nationalities. A culture of inclusion, respect, and collaboration." },
];

export default function CareersClient() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("Open Application");
  const [formData, setFormData] = useState({ FullName: "", Email: "", Phone: "", ResumeUrl: "", Message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data.filter((j: any) => j.is_active));
      }
    } catch (err) {
      console.error(err);
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
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Apply error", err);
      alert("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Perks */}
      <section className="section-alt py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="glass rounded-3xl p-8 text-center group hover:-translate-y-2 transition-smooth"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${p.color}18` }}>
                    <Icon className="w-7 h-7" style={{ color: p.color }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-3"
        >
          <span className="badge-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Open Positions</span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {jobs.length} roles currently open
          </h2>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--green)]">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-semibold tracking-widest uppercase">Loading Roles...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-dashed border-[var(--grey-light)]">
              <h3 className="text-xl font-bold mb-2">No Open Roles Right Now</h3>
              <p className="text-[var(--text-muted)]">Check back later or send us an open application!</p>
            </div>
          ) : (
            jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
              >
                <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:-translate-x-1 transition-smooth card-hover-green relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: job.color }} />

                  <div className="flex-1 space-y-1 pl-2">
                    <h3 className="font-bold text-lg group-hover:transition-colors" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
                    <div className="flex items-center flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span className="font-medium" style={{ color: job.color }}>{job.dept}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{job.type}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openApplyModal(job.title)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm flex-shrink-0 transition-smooth hover:scale-105"
                    style={{ background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}30` }}
                  >
                    Apply Now <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Open application CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 glass rounded-3xl p-10 text-center space-y-4 shadow-lg shadow-[var(--green-glow)]"
        >
          <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Don't see a role that fits? We hire exceptional people regardless.
          </p>
          <button
            onClick={() => openApplyModal("Open Application")}
            className="px-8 py-4 rounded-full font-bold text-white gradient-green hover:scale-105 hover:shadow-lg hover:shadow-[var(--green-glow)] transition-smooth inline-block"
          >
            Send Open Application
          </button>
        </motion.div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[var(--bg-base)] border border-[var(--grey-dark)] shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden shadow-black/50"
            >
              <div className="p-8 pb-6 border-b border-[var(--grey-dark)] flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">Apply For</h3>
                  <p className="text-[var(--green)] font-semibold mt-1">{selectedPosition}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center hover:bg-[var(--grey-dark)] transition-smooth text-[var(--text-muted)] hover:text-white"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
              </div>

              <div className="p-8">
                {submitSuccess ? (
                   <div className="text-center py-12">
                     <div className="w-20 h-20 bg-[var(--green)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Application Sent!</h3>
                     <p className="text-[var(--text-secondary)]">Thank you for applying. We will review your application and get back to you soon.</p>
                   </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" value={formData.FullName} onChange={e => setFormData({...formData, FullName: e.target.value})} className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green)] transition-smooth" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Email Address <span className="text-red-500">*</span></label>
                        <input required type="email" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green)] transition-smooth" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Phone Number</label>
                        <input type="tel" value={formData.Phone} onChange={e => setFormData({...formData, Phone: e.target.value})} className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green)] transition-smooth" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Resume / Portfolio URL</label>
                        <input type="url" value={formData.ResumeUrl} onChange={e => setFormData({...formData, ResumeUrl: e.target.value})} className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green)] transition-smooth" placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Message / Cover Letter</label>
                      <textarea rows={4} value={formData.Message} onChange={e => setFormData({...formData, Message: e.target.value})} className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green)] transition-smooth resize-none" placeholder="Tell us why you are a great fit..."></textarea>
                    </div>

                    <div className="pt-2">
                      <button disabled={submitting} type="submit" className="w-full bg-[var(--green)] hover:bg-[var(--green-dark)] text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--green-glow)] transition-all transform hover:-translate-y-1 hover:shadow-xl focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2">
                         {submitting ? <Loader2 size={20} className="animate-spin" /> : null}
                         {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
