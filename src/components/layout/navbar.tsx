"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ArrowRight } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Company Profile", href: "https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf", isExternal: true },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Solutions", href: "/solutions" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

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
  const primaryLinks = links.filter((link) =>
    ["About Us", "Projects", "Solutions", "Contact"].includes(link.name)
  );

  return (
    <>
      <nav className={`fixed home-navbar ${showGlassBar ? "home-navbar--scrolled" : ""} ${menuOpen ? "home-navbar--menu-open" : ""} top-0 left-0 right-0 z-40`}>
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
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-4 group"
            >
              <div className="home-menu-button">
                <Menu className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Side Menu Drawer (Right Side) ────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#052c65]/25 backdrop-blur-md"
            />

            {/* Content Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-[420px] bg-white/95 border-l border-[#052c65]/10 flex flex-col shadow-[-20px_0_60px_rgba(5,44,101,0.18)] backdrop-blur-2xl"
            >
              <div className="p-8 flex items-center justify-between border-b border-[#052c65]/10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#159bb4]">Navigation</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full border border-[#052c65]/10 flex items-center justify-center text-[#052c65] hover:border-red-500/40 hover:text-red-500 transition-smooth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable links area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-7 space-y-0">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <Link
                      href={link.href}
                      target={(link as any).isExternal ? "_blank" : undefined}
                      rel={(link as any).isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between py-3.5 border-b border-[#052c65]/8 transition-smooth"
                    >
                      <span className="text-xl md:text-2xl font-semibold tracking-[-0.025em] text-[#052c65] group-hover:text-[#159bb4] group-hover:translate-x-1 transition-all">
                        {link.name}
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#159bb4] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 border-t border-[#052c65]/10 bg-[#eef9fb]/70">
                <div className="space-y-6">
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Have a project in mind? Let&apos;s build something intelligent together.
                  </p>
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full bg-[#052c65] py-5 rounded-2xl text-white font-bold text-lg hover:bg-[#0b427f] hover:scale-[1.02] transition-smooth group"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
