"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const SMOOTH = [0.16, 1, 0.3, 1] as const;

const services = [
  "IT Consultancy",
  "Infrastructure & Data Center",
  "Cybersecurity",
  "Cloud Services",
  "Managed IT Services",
  "AI & Data Analytics",
  "Smart HRIS",
  "Other",
];

const faqs = [
  {
    q: "How long does implementation typically take?",
    a: "Most engagements go live in 4–12 weeks depending on scope, integrations, and data migration. We share a clear timeline after the discovery workshop.",
  },
  {
    q: "What's your pricing model?",
    a: "We price by solution footprint and usage — typically a setup fee plus transparent monthly licensing or managed-service retainers. Every proposal is tailored, with no hidden costs.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. Every rollout includes onboarding, training, and ongoing support. Managed clients get 24/7 coverage with defined SLAs.",
  },
  {
    q: "Can you integrate with our existing systems?",
    a: "Absolutely. We connect to common ERPs, payroll engines, identity providers, and custom APIs so your stack stays unified.",
  },
  {
    q: "What's the onboarding process like?",
    a: "Discovery → solution design → configuration → parallel testing → go-live. You get a dedicated success lead at every step.",
  },
];

const fallbackLogos = ["Abans", "SkyNet", "Köhl", "Commercial Insurance"];

const FIDA_HQ = {
  lat: 6.8482656,
  lng: 79.8972186,
  placeId: "0x3ae25993b9313d8d:0xf13624cdae6b9114",
  name: "FIDA Global Private Limited",
  mapsUrl: "https://maps.app.goo.gl/jtbKvSpwtXYAdAxv7",
  address: "No. 215 C, Raththanapitiya, Boralesgamuwa 10290, Sri Lanka",
};

function getMapEmbedSrc(focused: boolean) {
  if (focused) {
    const place = encodeURIComponent(`${FIDA_HQ.name}, ${FIDA_HQ.address}`);
    return `https://maps.google.com/maps?q=${place}&z=17&hl=en&output=embed`;
  }
  return `https://maps.google.com/maps?q=${FIDA_HQ.lat},${FIDA_HQ.lng}&z=15&hl=en&output=embed`;
}

interface Customer {
  id: number;
  name: string;
  logo_url: string | null;
  order_index: number;
  status: string;
}

const emptyForm = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
  employee_count: "",
  division_status: "",
  company_count: "",
};

export default function ContactClient() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mapFocused, setMapFocused] = useState(false);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Customer[]) => {
        const activeCustomers = data.filter(
          (c) => c.status === "Active" && c.logo_url && !c.name.toLowerCase().includes("sipway")
        );
        const exactMatches = ["abans", "abance", "sky net", "kablr"];
        const topLogos: Customer[] = [];
        
        exactMatches.forEach(name => {
          const match = activeCustomers.find(c => c.name.toLowerCase() === name);
          if (match && !topLogos.some((l) => l.id === match.id)) topLogos.push(match);
        });

        const kelani = activeCustomers.find(
          (c) => c.name.toLowerCase().includes("kalani") || c.name.toLowerCase().includes("kelani")
        );
        if (kelani && !topLogos.some((l) => l.id === kelani.id)) topLogos.push(kelani);

        setCustomers(topLogos);
        
      })
      .catch(() => setCustomers([]));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
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
        setForm(emptyForm);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  let logos = customers.length
    ? customers
    : fallbackLogos.map((name, i) => ({ id: i, name, logo_url: null, order_index: i, status: "Active" }));

  return (
    <>
      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__wash" aria-hidden="true" />
        <div className="container mx-auto px-6 relative z-10 pt-44 pb-20 md:pt-56 md:pb-24 text-center">
          <motion.h1
            className="contact-hero__title"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: SMOOTH }}
          >
            Start Your <span>Digital</span> Journey Today
          </motion.h1>
          <motion.p
            className="contact-hero__subtitle"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: SMOOTH }}
          >
            Connect with our team of global enterprise consultants to unlock your
            company&apos;s full potential in the digital-first economy.
          </motion.p>
        </div>
      </section>

      {/* ── Main grid ── */}
      <section className="contact-main pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-7 lg:items-stretch items-start w-full">
            {/* Form card */}
            <motion.div
              className="lg:col-span-7 min-w-0 w-full"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: SMOOTH }}
            >
              <div className="contact-card contact-form-card">
                {sent ? (
                  <div className="text-center py-10 space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F172A]">Message Received!</h2>
                    <p className="text-[#64748B] text-[15px] leading-relaxed max-w-md mx-auto">
                      Our team will get back to you within 24 hours. In the meantime, feel free to explore our solutions.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="contact-btn contact-btn--primary inline-flex"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <h2 className="contact-card__title">Send Us a Message</h2>
                      <p className="contact-card__desc">
                        Have a project in mind? Tell us a bit about your needs and we&apos;ll respond within one business day.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field
                        label="Full Name"
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                        required
                      />
                      <Field
                        label="Work Email"
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                        required
                      />
                    </div>

                    <Field
                      label="Company"
                      id="company"
                      type="text"
                      placeholder="Acme Corporation"
                      value={form.company}
                      onChange={(v) => setForm({ ...form, company: v })}
                      required
                    />

                    <div>
                      <label htmlFor="service" className="contact-label">
                        Service Interested In
                      </label>
                      <div className="contact-select-wrap">
                        <select
                          id="service"
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="contact-input contact-select"
                          required
                        >
                          <option value="">Select a service...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="contact-select-chevron" size={16} aria-hidden />
                      </div>
                    </div>

                    <AnimatePresence>
                      {form.service === "Smart HRIS" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid sm:grid-cols-3 gap-4 overflow-hidden"
                        >
                          <Field
                            label="Approx. Employees"
                            id="employee_count"
                            type="text"
                            placeholder="e.g. 250+"
                            value={form.employee_count}
                            onChange={(v) => setForm({ ...form, employee_count: v })}
                          />
                          <Field
                            label="No. of Companies"
                            id="company_count"
                            type="text"
                            placeholder="e.g. 3"
                            value={form.company_count}
                            onChange={(v) => setForm({ ...form, company_count: v })}
                          />
                          <div>
                            <label htmlFor="division_status" className="contact-label">
                              Multi-Company Logic
                            </label>
                            <div className="contact-select-wrap">
                              <select
                                id="division_status"
                                value={form.division_status}
                                onChange={(e) => setForm({ ...form, division_status: e.target.value })}
                                className="contact-input contact-select"
                              >
                                <option value="">Divisions same?</option>
                                <option value="Same">Yes - Same for all</option>
                                <option value="Different">No - Different for each</option>
                                <option value="Single">N/A (Single Company)</option>
                              </select>
                              <ChevronDown className="contact-select-chevron" size={16} aria-hidden />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label htmlFor="message" className="contact-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us about your project or question..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        className="contact-input contact-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`contact-btn contact-btn--primary w-full sm:w-auto ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {error && (
                      <p className="text-red-500 text-sm font-medium text-center sm:text-left">{error}</p>
                    )}
                  </form>
                )}

                {/* Trusted logos */}
                <div className="contact-trust overflow-hidden">
                  <p className="contact-trust__label">Trusted by industry leaders</p>
                  <div className="contact-trust__logos marquee-track sm:!animate-none sm:!w-full">
                    {logos.map((logo) =>
                      logo.logo_url ? (
                        <img key={logo.id} src={logo.logo_url} alt={logo.name} />
                      ) : (
                        <span key={logo.id}>{logo.name}</span>
                      )
                    )}
                    {/* Duplicate logos to create seamless infinite scroll on mobile */}
                    {logos.map((logo) =>
                      logo.logo_url ? (
                        <img key={`dup-${logo.id}`} className="sm:hidden" src={logo.logo_url} alt={logo.name} />
                      ) : (
                        <span key={`dup-${logo.id}`} className="sm:hidden">{logo.name}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column */}
            <div className="lg:col-span-5 flex flex-col lg:h-full gap-5 min-w-0 w-full">
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-5">
                <motion.div
                  className="contact-card w-1/2 sm:w-full !p-3 sm:!p-6 flex flex-col"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: 0.08, ease: SMOOTH }}
                >
                  <h3 className="font-bold text-[#0F172A] text-[12px] sm:text-[1.15rem] mb-3 sm:mb-5">Quick Contact</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <a href="mailto:info@fidaglobal.com" className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 group">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0 group-hover:bg-[#e0f2fe] transition-colors">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0284c7]" />
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider mb-0.5">Email Us</p>
                        <p className="text-[9px] sm:text-[13px] font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors break-all">info@fidaglobal.com</p>
                      </div>
                    </a>
                    <a href="tel:+94117108020" className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 group">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0 group-hover:bg-[#e0f2fe] transition-colors">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0284c7]" />
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider mb-0.5">Call Us</p>
                        <p className="text-[9px] sm:text-[13px] font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors whitespace-nowrap">+94 11 710 80 20</p>
                      </div>
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="contact-card w-1/2 sm:w-full !p-3 sm:!p-6 flex flex-col"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: 0.14, ease: SMOOTH }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-4">
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0284c7]" />
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-[12px] sm:text-[1.15rem] m-0">Our Office</h3>
                  </div>
                  <div className="text-[9px] sm:text-[13px] leading-relaxed text-[#64748B] mb-2 sm:mb-4 flex-1">
                    <p className="font-semibold text-[#0F172A] mb-1">FIDA Global Office</p>
                    Raththanapitiya,
                    <br />
                    215 C Colombo - Horana Rd,
                    <br />
                    Boralesgamuwa
                    <br />
                    10290
                  </div>
                  <a href="tel:+94117108020" className="text-[10px] sm:text-[13px] font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors mt-auto block whitespace-nowrap">
                    +94 11 710 80 20
                  </a>
                </motion.div>
              </div>

              <motion.div
                className={`contact-map${mapFocused ? " contact-map--focused" : ""} lg:flex-1`}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.2, ease: SMOOTH }}
              >
                <iframe
                  key={mapFocused ? "focused" : "overview"}
                  title="FIDA Global HQ map"
                  src={getMapEmbedSrc(mapFocused)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {!mapFocused && (
                  <button
                    type="button"
                    className="contact-map__pin"
                    aria-label="Show FIDA Global HQ on map"
                    onClick={() => setMapFocused(true)}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>FIDA GLOBAL HQ</span>
                  </button>
                )}
                {mapFocused && (
                  <a
                    href={FIDA_HQ.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map__open"
                  >
                    Open in Maps
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="contact-faq pb-72 md:pb-96">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2
            className="contact-faq__title"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: SMOOTH }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-3 mt-10">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={faq.q}
                  className={`contact-faq__item ${open ? "is-open" : ""}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: SMOOTH }}
                >
                  <button
                    type="button"
                    className="contact-faq__trigger"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`contact-faq__chevron ${open ? "rotate-180" : ""}`}
                      size={18}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: SMOOTH }}
                        className="overflow-hidden"
                      >
                        <p className="contact-faq__answer">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


    </>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="contact-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="contact-input"
      />
    </div>
  );
}

function QuickRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="contact-quick-row group">
      <div className="contact-icon-circle">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="contact-quick-row__label">{label}</p>
        <p className="contact-quick-row__value">{value}</p>
      </div>
    </a>
  );
}
