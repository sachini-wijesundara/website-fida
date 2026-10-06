"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Share2, Phone, MapPin, ArrowUpRight, FileText } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const solutionsLinks = [
  { name: "Smart HRIS", href: "/solutions/01" },
  { name: "FIDA Task Manager", href: "/solutions/04" },
  { name: "FIDA Helpdesk System", href: "/solutions/05" },
  { name: "Access Control & Attendance", href: "/solutions/02" },
  { name: "FIDA Business Consultancy", href: "/solutions/03" },
];

const companyLinks: { name: string; href: string; isExternal?: boolean; download?: boolean }[] = [
  { name: "About", href: "/about" },
  { name: "Solutions", href: "/solutions" },
  { name: "Company Profile", href: "/FIDA%20Global%20Company%20Profile.pdf", isExternal: true },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://www.fidaglobal.com";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "FIDA Global",
          text: "FIDA Global — Business Partner For Success And Beyond",
          url,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // ignore
      }
    }
  };

  return (
    <footer className="relative bg-[#f4f9fd] text-[#052c65] site-footer mt-16 lg:mt-24">
      {/* ── CTA banner halfly overlapped over the footer part ── */}
      <div className="container mx-auto px-3 sm:px-6 max-w-4xl relative z-20 -translate-y-7 lg:-translate-y-1/2 mb-[-28px] lg:mb-[-120px]">
        <motion.div
          className="contact-cta mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Experience Borderless Talent</h2>
          <p>
            FIDA Global provides the technological foundation for the modern, distributed enterprise. From HRIS
            to global consultancy, we empower workforce potential.
          </p>
          <div className="contact-cta__actions">
            <Link href="/solutions" className="contact-btn contact-btn--primary">
              Explore Solutions
            </Link>
            <Link href="/contact" className="contact-btn contact-btn--outline">
              Contact Sales
            </Link>
          </div>

          <form
            className="contact-subscribe"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!subscribeEmail.trim()) return;
              setSubscribed(true);
              setSubscribeEmail("");
            }}
          >
            {subscribed ? (
              <p className="contact-subscribe__done">Thanks — you&apos;re on the list.</p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  aria-label="Email for newsletter"
                />
                <button type="submit">
                  SUBSCRIBE <ArrowUpRight className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
          <p className="text-[11px] text-slate-500 mt-2.5 text-center leading-relaxed">
            By subscribing, you agree to our{" "}
            <Link href="/privacy" className="text-[#0047e1] font-semibold underline hover:text-[#0037b0] transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </motion.div>
      </div>

      {/* Main footer contents container */}
      <div className="container mx-auto px-6 pb-12 pt-16 lg:pt-0 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 text-center lg:text-left">

          {/* Column 1: Brand details */}
          <div className="lg:col-span-3 space-y-1.5 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/footer logo.png"
                alt="FIDA Global"
                className="h-20 md:h-28 w-auto object-contain lg:-ml-4"
              />
            </Link>
            <p className="text-[#536b8a] text-[15px] lg:text-[14px] leading-relaxed font-semibold max-w-[280px]">
              BUSINESS PARTNER FOR SUCCESS AND BEYOND

            </p>
            {/* Social Icons (Plain, no border/background cards) */}
            <div className="flex items-center justify-center lg:justify-start gap-5 pt-2">
              <a
                href="https://www.facebook.com/FIDAGlobal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FIDA Global on Facebook"
                title="Facebook"
                className="text-[#536b8a] hover:text-blue-600 transition-colors"
              >
                <FacebookIcon className="w-6 h-6 lg:w-5 lg:h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/fida-global"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FIDA Global on LinkedIn"
                title="LinkedIn"
                className="text-[#536b8a] hover:text-blue-600 transition-colors"
              >
                <LinkedinIcon className="w-6 h-6 lg:w-5 lg:h-5" />
              </a>
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share FIDA Global website"
                  title="Share"
                  className="text-[#536b8a] hover:text-blue-600 transition-colors p-0 cursor-pointer bg-transparent border-0 inline-flex items-center justify-center"
                >
                  <Share2 className="w-6 h-6 lg:w-5 lg:h-5" />
                </button>
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#052c65] text-white text-[11px] font-semibold rounded shadow-md whitespace-nowrap pointer-events-none">
                    Link copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Solutions links */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-[17px] lg:text-[15px] font-bold text-[#052c65] mb-5">Solutions</h3>
            <ul className="space-y-4 lg:space-y-3.5">
              {solutionsLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[15px] lg:text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div className="lg:col-span-2">
            <h3 className="text-[17px] lg:text-[15px] font-bold text-[#052c65] mb-5">Company</h3>
            <ul className="space-y-4 lg:space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  {link.download ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="FIDA Global Company Profile.pdf"
                      className="text-[15px] lg:text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="text-[15px] lg:text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch contacts */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-4 flex flex-col items-center lg:items-start">
            <h3 className="text-[17px] lg:text-[15px] font-bold text-[#052c65] mb-2 lg:mb-5">Get in Touch</h3>
            <div className="space-y-4 lg:space-y-3.5 flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-[15px] lg:text-sm text-[#475569] font-semibold">
                <Mail className="w-5 h-5 lg:w-4 lg:h-4 text-[#8fa2b8] shrink-0" />
                <a href="mailto:info@fidaglobal.com" className="hover:text-blue-600 transition-colors">
                  info@fidaglobal.com
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-[15px] lg:text-sm text-[#475569] font-semibold">
                <Phone className="w-5 h-5 lg:w-4 lg:h-4 text-[#8fa2b8] shrink-0" />
                <a href="tel: +94 11 710 80 20" className="hover:text-blue-600 transition-colors">
                 +94 11 710 80 20
                </a>
              </div>
              <div className="flex items-start justify-center lg:justify-start gap-3 text-[15px] lg:text-sm text-[#475569] font-semibold text-center lg:text-left">
                <MapPin className="w-5 h-5 lg:w-4 lg:h-4 text-[#8fa2b8] shrink-0 lg:mt-0.5" />
                <span>
                  No. 215 C, Raththanapitiya<br />
                  Boralesgamuwa, 10290, Sri Lanka.
                </span>
              </div>
            </div>

            <div className="pt-5 lg:pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 lg:px-7 lg:py-3 bg-[#004dfc] hover:bg-[#003bd9] text-white text-[13px] lg:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full transition-all shadow-[0_8px_20px_rgba(0,77,252,0.24)] hover:shadow-[0_12px_24px_rgba(0,77,252,0.32)] hover:-translate-y-[1px] w-fit"
              >
                Book a Consultation
              </Link>
              <a
                href="/FIDA%20Global%20Company%20Profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 lg:px-6 lg:py-3 bg-white border border-slate-200 hover:border-blue-600 text-[#052c65] hover:text-blue-600 text-[13px] lg:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full transition-all shadow-sm hover:-translate-y-[1px] w-fit"
              >
                <FileText className="w-4 h-4 text-[#004dfc]" />
                <span>Company Profile</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Centered copyright bottom bar with pure white background */}
      <div className="bg-white py-5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[12px] text-[#64748b] font-semibold flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <span>© FIDA Global. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-cookie-banner"));
                }
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
