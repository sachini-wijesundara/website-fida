"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const offices = [
  { city: "Colombo", country: "Sri Lanka (HQ)", address: "No. 215 C, Raththanapitiya, Boralesgamuwa 10290", phone: "+94 11 710 80 20", color: "var(--green)" },
];

const services = [
  "IT Consultancy", "Infrastructure & Data Center", "Cybersecurity", "Cloud Services",
  "Managed IT Services", "AI & Data Analytics", "Smart HRIS", "Other",
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "", employee_count: "", division_status: "", company_count: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", company: "", service: "", message: "", employee_count: "", division_status: "", company_count: "" });
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 space-y-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-14">
          {/* Left — form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="glass rounded-3xl p-16 text-center space-y-6">
                <div className="text-6xl">🎉</div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Message Received!</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Our team will get back to you within 24 hours. In the meantime, feel free to explore our services.
                </p>
                <button onClick={() => setSent(false)} className="px-8 py-3 rounded-full font-bold text-white gradient-green">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 space-y-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Send us a message</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>We typically respond within 4 business hours.</p>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { id: "name", label: "Full Name", type: "text", placeholder: "John Smith" },
                    { id: "email", label: "Work Email", type: "email", placeholder: "john@company.com" },
                    { id: "company", label: "Company", type: "text", placeholder: "Acme Corporation" },
                  ].map((f) => (
                    <div key={f.id} className={f.id === "company" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as Record<string, string>)[f.id]}
                        onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                        required
                        className="w-full rounded-xl px-5 py-3.5 text-sm transition-smooth focus:outline-none focus:ring-2"
                        style={{
                          background: "var(--bg-elevated)",
                          color: "var(--text-primary)",
                          border: "1px solid var(--grey-dark)",
                          // @ts-ignore
                          "--tw-ring-color": "var(--green)",
                        }}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Service Interested In</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl px-5 py-3.5 text-sm transition-smooth focus:outline-none focus:ring-2"
                      style={{ background: "var(--bg-elevated)", color: form.service ? "var(--text-primary)" : "var(--text-muted)", border: "1px solid var(--grey-dark)" }}
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Conditional Fields for Smart HRIS */}
                  <AnimatePresence>
                    {form.service === "Smart HRIS" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sm:col-span-2 grid sm:grid-cols-3 gap-5 overflow-hidden"
                      >
                        {[
                          { id: "employee_count", label: "Approx. Employees", placeholder: "e.g. 250+" },
                          { id: "company_count", label: "No. of Companies", placeholder: "e.g. 3" },
                        ].map((f) => (
                          <div key={f.id}>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[var(--green)]">{f.label}</label>
                            <input
                              type="text"
                              placeholder={f.placeholder}
                              value={(form as any)[f.id]}
                              onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                              className="w-full rounded-xl px-5 py-3.5 text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--grey-dark)] focus:outline-none focus:ring-2"
                              style={{ "--tw-ring-color": "var(--green)" } as any}
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[var(--green)]">Multi-Company Logic</label>
                          <select
                            value={form.division_status}
                            onChange={(e) => setForm({ ...form, division_status: e.target.value })}
                            className="w-full rounded-xl px-5 py-3.5 text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--grey-dark)] focus:outline-none focus:ring-2"
                            style={{ "--tw-ring-color": "var(--green)" } as any}
                          >
                            <option value="">Divisions/Designations same?</option>
                            <option value="Same">Yes - Same for all</option>
                            <option value="Different">No - Different for each</option>
                            <option value="Single">N/A (Single Company)</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your project, challenge, or question..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="w-full rounded-xl px-5 py-3.5 text-sm resize-none transition-smooth focus:outline-none focus:ring-2"
                      style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--grey-dark)" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white gradient-green hover:scale-[1.02] transition-smooth shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
                {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}
              </form>
            )}
          </motion.div>

          {/* Right — info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick contact */}
            <div className="glass rounded-3xl p-8 space-y-5">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Quick Contact</h3>
              {[
                { icon: Mail, label: "General Enquiries", value: "info@fidaglobal.com", color: "var(--green)" },
                { icon: Mail, label: "Sales", value: "sales@fidaglobal.com", color: "var(--blue)" },
                { icon: Phone, label: "Global HQ", value: "+94 11 710 80 20", color: "var(--green)" },
                { icon: Clock, label: "Support Hours", value: "24/7 for managed clients", color: "var(--grey-light)" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{c.label}</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Offices */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Our Offices</h3>
              {offices.map((o) => (
                <div key={o.city} className="glass rounded-2xl p-5 flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: o.color }} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{o.city}, <span style={{ color: "var(--text-muted)" }}>{o.country}</span></p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{o.address}</p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: o.color }}>
                      <Phone className="w-3 h-3" /> {o.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Map Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6"
      >
        <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-[#052c65]/10 shadow-[0_25px_70px_rgba(5,44,101,.12)] group">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10" />
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1878.4357602058476!2d79.8937989973887!3d6.848261314983057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a898bd03f95%3A0xc3c5b5278c54178a!2sRaththanapitiya!5e0!3m2!1sen!2slk!4v1713596000000!5m2!1sen!2slk"
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(.35) saturate(.75) opacity(.88)" }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-xl animate-pulse rounded-full" />
              <div className="glass px-4 py-2 rounded-full border border-primary/40 flex items-center gap-2 whitespace-nowrap shadow-2xl">
                 <MapPin className="w-4 h-4 text-primary" />
                 <span className="text-xs font-bold text-[#052c65] uppercase tracking-widest">FIDA Global HQ</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
