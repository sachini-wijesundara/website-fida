"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Mail, Share2, Phone, MapPin, Network, ArrowUpRight } from "lucide-react";

const solutionsLinks = [
  { name: "Smart HRIS", href: "/solutions" },
  { name: "FIDA Task Manager", href: "/solutions" },
  { name: "FIDA Helpdesk System", href: "/solutions" },
  { name: "Access Control & Attendance", href: "/solutions" },
  { name: "FIDA Business Consultancy", href: "/services" },
];

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Company Profile", href: "https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf", isExternal: true },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative bg-[#f4f9fd] border-t border-[#052c65]/8 text-[#052c65] -mt-24 md:-mt-32">
      {/* ── CTA banner halfly overlapped over the footer part ── */}
      <div className="container mx-auto px-6 max-w-4xl relative z-20 -translate-y-1/2 mb-[-120px]">
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
                  required
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
      <div className="container mx-auto px-6 pb-16 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand details */}
          <div className="lg:col-span-3 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/Fidalong.png"
                alt="FIDA Global"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[#536b8a] text-[14px] leading-relaxed font-semibold max-w-[220px]">
              The technology layer behind borderless workforces.
            </p>
            {/* Social Icons (Plain, no border/background cards) */}
            <div className="flex items-center gap-4 pt-1">
              <a href="#" aria-label="Share" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Network" className="text-[#536b8a] hover:text-blue-600 transition-colors">
                <Network className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Solutions links */}
          <div className="lg:col-span-3 lg:pl-4">
            <h3 className="text-[15px] font-bold text-[#052c65] mb-5">Solutions</h3>
            <ul className="space-y-3.5">
              {solutionsLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div className="lg:col-span-2">
            <h3 className="text-[15px] font-bold text-[#052c65] mb-5">Company</h3>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm text-[#475569] hover:text-blue-600 transition-colors font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get in Touch contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[15px] font-bold text-[#052c65] mb-5">Get in Touch</h3>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-sm text-[#475569] font-semibold">
                <Mail className="w-4 h-4 text-[#8fa2b8] shrink-0" />
                <a href="mailto:info@fidaglobal.com" className="hover:text-blue-600 transition-colors">
                  info@fidaglobal.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#475569] font-semibold">
                <Phone className="w-4 h-4 text-[#8fa2b8] shrink-0" />
                <a href="tel:+15550000000" className="hover:text-blue-600 transition-colors">
                  +1 (555) 000-0000
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#475569] font-semibold">
                <MapPin className="w-4 h-4 text-[#8fa2b8] shrink-0" />
                <span>Global HQ, Enterprise District</span>
              </div>
            </div>
            
            <div className="pt-3">
              <Link
                href="/contact"
                className="text-[13px] font-bold text-blue-600 hover:text-blue-700 underline decoration-blue-300 decoration-1 underline-offset-4 inline-flex items-center gap-1"
              >
                Book a Consultation <span className="text-[14px]">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Centered copyright bottom bar with pure white background */}
      <div className="bg-white border-t border-[#052c65]/8 py-5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[12px] text-[#64748b] font-semibold flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <span>© 2024 FIDA Global. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
