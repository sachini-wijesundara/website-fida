"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Mail, Share2, X as XIcon, ArrowUpRight } from "lucide-react";

const navGroups = [
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Company Profile", href: "https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf", isExternal: true },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "IT Consultancy", href: "/services/consultancy" },
      { name: "Infrastructure", href: "/services/infrastructure" },
      { name: "Managed Services", href: "/services/managed" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "Cloud Solutions", href: "/solutions/cloud" },
      { name: "Cybersecurity", href: "/solutions/security" },
      { name: "AI Integration", href: "/solutions/ai" },
      { name: "HR Automation", href: "/solutions/hr" },
    ],
  },
];

const socials = [
  { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: XIcon, href: "https://twitter.com", label: "Twitter / X" },
  { icon: Share2, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:info@fidaglobal.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="public-footer relative border-t border-border overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary opacity-5 blur-[120px] pointer-events-none rounded-full" />

      {/* Rotating Digital Seal (Inspired by ilabsolutions.it) */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 pointer-events-none opacity-20">
        <div className="relative w-full h-full animate-rotate-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/40">
            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
            <text className="text-[6px] font-bold uppercase tracking-[0.4em]">
              <textPath xlinkHref="#circlePath">
                FIDA GLOBAL • INTELLIGENT SYSTEMS • INNOVATION • EXCELLENCE •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/Fidalong.png"
                alt="FIDA Global"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-muted leading-relaxed max-w-xs">
              Intelligent IT solutions for modern enterprises. Building the infrastructure
              of tomorrow, today.
            </p>
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Stay in the loop
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 glass border border-border rounded-full px-5 py-3 text-sm bg-transparent text-[var(--text-primary)] placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="gradient-green text-white px-5 py-3 rounded-full text-sm font-bold hover:scale-105 transition-smooth flex items-center gap-1">
                  Subscribe <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 glass rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-smooth"
                >
                  <s.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">
                  {group.title}
                </h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={(link as any).isExternal ? "_blank" : undefined}
                        rel={(link as any).isExternal ? "noopener noreferrer" : undefined}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--blue-dark)] transition-colors font-medium"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} FIDA Global. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-muted hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
