"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Mail, Share2, Phone, MapPin, Network, ArrowUpRight } from "lucide-react";

const solutionsLinks = [
  { name: "Smart HRIS", href: "/solutions/01" },
  { name: "FIDA Task Manager", href: "/solutions/04" },
  { name: "FIDA Helpdesk System", href: "/solutions/05" },
  { name: "Access Control & Attendance", href: "/solutions/02" },
  { name: "FIDA Business Consultancy", href: "/solutions/03" },
];

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "solutions", href: "/solutions" },
  { name: "Company Profile", href: "/FIDAGlobalProfile2024.pdf", isExternal: true, download: true },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative bg-[#f4f9fd] text-[#052c65] site-footer mt-24 lg:mt-48">
      {/* ── CTA banner halfly overlapped over the footer part ── */}
      <div className="container mx-auto px-6 max-w-4xl relative z-20 -translate-y-12 lg:-translate-y-1/2 mb-[-48px] lg:mb-[-120px]">
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
        </motion.div>
      </div>

      {/* Main footer contents container */}
      <div className="container mx-auto px-6 pb-12 pt-16 lg:pt-0 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 text-center lg:text-left">

          {/* Column 1: Brand details */}
          <div className="lg:col-span-3 space-y-6 flex flex-col items-center lg:items-start">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/Fidalong.png"
                alt="FIDA Global"
                className="h-20 md:h-24 w-auto object-contain lg:-ml-2"
              />
            </Link>
            <p className="text-[#536b8a] text-[15px] lg:text-[14px] leading-relaxed font-semibold max-w-[280px]">
              The technology layer behind borderless workforces.
            </p>
            {/* Social Icons (Plain, no border/background cards) */}
            <div className="flex items-center justify-center lg:justify-start gap-5 pt-2">
              <a href="#" aria-label="Share" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Share2 className="w-6 h-6 lg:w-5 lg:h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Globe className="w-6 h-6 lg:w-5 lg:h-5" />
              </a>
              <a href="#" aria-label="Network" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Network className="w-6 h-6 lg:w-5 lg:h-5" />
              </a>
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
                  <Link
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    download={link.download ? "FIDAGlobalProfile2024.pdf" : undefined}
                    className="text-[15px] lg:text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
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

            <div className="pt-5 lg:pt-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 lg:px-7 lg:py-3 bg-[#004dfc] hover:bg-[#003bd9] text-white text-[13px] lg:text-[11px] font-bold tracking-[0.08em] uppercase rounded-full transition-all shadow-[0_8px_20px_rgba(0,77,252,0.24)] hover:shadow-[0_12px_24px_rgba(0,77,252,0.32)] hover:-translate-y-[1px] w-fit"
              >
                Book a Consultation
              </Link>
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
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
