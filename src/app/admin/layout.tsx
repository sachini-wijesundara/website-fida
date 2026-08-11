"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Users, BarChart3, Briefcase, Award, Lightbulb, MessageSquare, Layout, Bot, Calendar, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isLoginPage = pathname === "/admin/login";

  React.useEffect(() => {
    if (isLoginPage) return;

    const timer = window.setTimeout(() => {
      // Warm the two slowest remote-data endpoints while the dashboard is idle.
      void Promise.allSettled([
        fetch("/api/teams?summary=true", { priority: "low" } as RequestInit),
        fetch("/api/projects?summary=true", { priority: "low" } as RequestInit),
      ]);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback
      window.location.href = "/admin/login";
    }
  };

  if (isLoginPage) {
    return <div className="admin-theme">{children}</div>;
  }

  return (
    <div className="admin-shell flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] admin-theme">
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-menu-button fixed left-4 top-4 z-50 hidden h-11 w-11 items-center justify-center rounded-xl border border-[var(--grey-dark)] bg-[var(--bg-surface)] text-white shadow-xl"
        aria-label={sidebarOpen ? "Close admin menu" : "Open admin menu"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
          className="admin-sidebar-backdrop fixed inset-0 z-30 hidden bg-slate-950/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar w-72 border-r border-[var(--grey-dark)] bg-[var(--bg-surface)] fixed h-screen z-40 flex flex-col ${sidebarOpen ? "is-open" : ""}`}>
        <div className="px-7 py-8 shrink-0">
          <Link href="/admin" className="admin-brand flex items-center gap-3.5">
            <div className="admin-brand-mark w-11 h-11 rounded-[14px] flex items-center justify-center">
              <span className="font-black text-lg">F</span>
            </div>
            <div>
              <h1 className="admin-brand-title font-black text-lg leading-none">FIDA</h1>
              <p className="admin-brand-subtitle text-[9px] uppercase tracking-[0.2em] mt-1.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/admin"} />
          <div className="mt-8 mb-2 px-4">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-semibold">Content</p>
          </div>
          <SidebarLink href="/admin/timeline" icon={<Calendar size={20} />} label="Company Timeline" active={pathname.startsWith("/admin/timeline")} />
          <SidebarLink href="/admin/blog" icon={<FileText size={20} />} label="Manage Blogs" active={pathname.startsWith("/admin/blog")} />
          <SidebarLink href="/admin/projects" icon={<Briefcase size={20} />} label="Manage Projects" active={pathname.startsWith("/admin/projects")} />
          <SidebarLink href="/admin/expertise" icon={<Award size={20} />} label="Our Expertise" active={pathname.startsWith("/admin/expertise")} />
          <SidebarLink href="/admin/services" icon={<Layout size={20} />} label="Manage Services" active={pathname.startsWith("/admin/services")} />
          <SidebarLink href="/admin/features" icon={<Lightbulb size={20} />} label="Manage Features" active={pathname.startsWith("/admin/features")} />
          <SidebarLink href="/admin/testimonials" icon={<MessageSquare size={20} />} label="Testimonials" active={pathname.startsWith("/admin/testimonials")} />
          <SidebarLink href="/admin/inquiries" icon={<MessageSquare size={20} />} label="Inquiries" active={pathname.startsWith("/admin/inquiries")} />
          <SidebarLink href="/admin/teams" icon={<Users size={20} />} label="Team Showcase" active={pathname.startsWith("/admin/teams")} />
          <SidebarLink href="/admin/solutions" icon={<Briefcase size={20} />} label="System Solutions" active={pathname.startsWith("/admin/solutions")} />
          <SidebarLink href="/admin/customers" icon={<Users size={20} />} label="Manage Customers" active={pathname.startsWith("/admin/customers")} />
          <SidebarLink href="/admin/careers" icon={<Briefcase size={20} />} label="Manage Careers" active={pathname.startsWith("/admin/careers")} />
          <SidebarLink href="/admin/job-applications" icon={<Users size={20} />} label="Job Applications" active={pathname.startsWith("/admin/job-applications")} />
          
          <div className="mt-8 mb-2 px-4">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-semibold">System</p>
          </div>
          <SidebarLink href="/admin/ai-knowledge" icon={<Bot size={20} />} label="AI Knowledge Base" active={pathname.startsWith("/admin/ai-knowledge")} />
          <SidebarLink href="/admin/users" icon={<Users size={20} />} label="Users" active={pathname === "/admin/users"} />
          <SidebarLink href="/admin/analytics" icon={<BarChart3 size={20} />} label="Analytics" active={pathname === "/admin/analytics"} />
          <SidebarLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" active={pathname === "/admin/settings"} />
        </nav>

        <div className="p-4 shrink-0 border-t border-[var(--grey-dark)] bg-[var(--bg-surface)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-smooth group"
          >
            <span className="text-[var(--text-muted)] group-hover:text-red-400 transition-smooth">
              <LogOut size={20} />
            </span>
            <span className="text-sm font-medium group-hover:text-[var(--text-primary)] transition-smooth">
              Exit Admin
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main flex-1 ml-72 p-10 lg:p-12">
        <div className="max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`admin-nav-link flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-smooth group ${active ? 'is-active bg-[var(--bg-elevated)] text-[var(--green)]' : 'hover:bg-[var(--bg-elevated)]'}`}
    >
      <span className={`${active ? 'text-[var(--green)]' : 'text-[var(--text-muted)] group-hover:text-[var(--green)]'} transition-smooth`}>
        {icon}
      </span>
      <span className={`text-sm font-medium ${active ? 'text-[var(--text-primary)]' : 'group-hover:text-[var(--text-primary)]'} transition-smooth`}>
        {label}
      </span>
    </Link>
  );
}
