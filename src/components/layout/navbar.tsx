"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ArrowRight, Mail, Phone } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Company Profile", href: "https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf", isExternal: true },
  { name: "Solutions", href: "/solutions" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const primaryLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Solutions", href: "/solutions" },
  { name: "Contact", href: "/contact" },
];

const SMOOTH = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const showGlassBar = !isHome || isScrolled;

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-[#052c65]/10 backdrop-blur-[5px]"
          />
        )}
      </AnimatePresence>

      <nav className={`fixed home-navbar ${showGlassBar ? "home-navbar--scrolled" : ""} top-0 left-0 right-0 z-40`}>
        <div className="home-navbar__inner">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/Fidalong.png"
              alt="FIDA Global"
              width="180"
              height="72"
              className="w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-8">
            {/* ── Desktop Links pulled "out" ── */}
            <div className="home-nav-links hidden lg:flex items-center gap-10">
              {primaryLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="home-nav-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Minimal trigger (On top bar) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3.5 group pointer-events-auto"
            >
              {menuOpen && (
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0047e1]">
                  MENU
                </span>
              )}
              <div className="home-menu-button">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </button>
          </div>

          {/* ── Dropdown Panel (Positioned absolutely relative to navbar inner) ── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: SMOOTH }}
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[340px] max-w-[calc(100vw-2.5rem)] bg-white border border-gray-100 rounded-[20px] shadow-[0_20px_50px_rgba(5,44,101,0.12)] overflow-hidden flex flex-col pointer-events-auto"
              >
                {/* Links List */}
                <div className="bg-white px-6 py-4 flex flex-col">
                  {links.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 transition-all duration-200 rounded-xl px-3 -mx-3 ${
                          isActive
                            ? "bg-blue-50/70 text-blue-600"
                            : "text-[#052c65]/90 hover:bg-blue-50/50 hover:text-blue-600"
                        }`}
                      >
                        <span className="text-[14px] font-bold tracking-tight">
                          {link.name}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 text-blue-600 transition-all duration-200 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom Contact Panel */}
                <div className="bg-[#f8fbfd] px-6 py-6 border-t border-gray-100 flex flex-col gap-5">
                  <div className="space-y-3">
                    <a
                      href="mailto:hello@fidaglobal.com"
                      className="flex items-center gap-3 text-xs font-semibold text-[#536b8a] hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#8fa2b8] shrink-0" />
                      <span>hello@fidaglobal.com</span>
                    </a>
                    <a
                      href="tel:+94115765757"
                      className="flex items-center gap-3 text-xs font-semibold text-[#536b8a] hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#8fa2b8] shrink-0" />
                      <span>+94 11 576 57 57</span>
                    </a>
                  </div>

                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="w-full bg-[#0047e1] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-center transition-all duration-300 hover:bg-[#0037b0] hover:scale-[1.02] shadow-[0_12px_24px_-6px_rgba(0,71,225,0.3)]"
                  >
                    Book a Consultation
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
