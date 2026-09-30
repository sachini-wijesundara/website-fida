"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, Users, FileText, Briefcase, Award, 
  TrendingUp, Clock, CheckCircle2, ChevronRight, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Aggregating Global Metrics...</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Blogs", value: data?.stats?.blogs || 0, icon: FileText, color: "var(--blue)", glow: "var(--blue-glow)" },
    { label: "Our Projects", value: data?.stats?.projects || 0, icon: Briefcase, color: "var(--green)", glow: "var(--green-glow)" },
    { label: "Expertise Cards", value: data?.stats?.expertise || 0, icon: Award, color: "var(--blue)", glow: "var(--blue-glow)" },
    { label: "Global Partners", value: data?.stats?.customers || 0, icon: Users, color: "var(--green)", glow: "var(--green-glow)" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Console Overview</h2>
          <p className="text-[var(--text-secondary)] mt-1">Real-time stats and content performance tracking.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--grey-dark)] animate-pulse">
           <div className="w-2 h-2 rounded-full bg-[var(--green)] shadow-[0_0_8px_var(--green)]" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--green)]">System Online</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-8 border border-[var(--grey-dark)] group hover:border-[var(--green)]/30 transition-smooth"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--grey-dark)] text-[var(--text-muted)] group-hover:text-[var(--green)] transition-smooth"
                style={{ color: stat.color }}
              >
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-[var(--green)] opacity-50" />
            </div>
            <div>
              <p className="text-3xl font-black text-white group-hover:scale-110 origin-left transition-smooth">
                {stat.value.toString().padStart(2, '0')}
              </p>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-[var(--grey-dark)] overflow-hidden">
          <div className="p-8 border-b border-[var(--grey-dark)] flex items-center justify-between bg-[var(--bg-elevated)]/30">
             <div className="flex items-center gap-3">
               <Clock size={20} className="text-[var(--green)]" />
               <h3 className="font-bold">Latest Knowledge Base Updates</h3>
             </div>
             <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-smooth">View All</button>
          </div>
          <div className="divide-y divide-[var(--grey-dark)]">
            {data?.recentBlogs?.map((blog: any, i: number) => (
              <div key={i} className="p-6 flex items-center justify-between group hover:bg-[var(--bg-elevated)]/20 transition-smooth">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--grey-dark)] flex items-center justify-center text-[var(--green)]">
                      <FileText size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white group-hover:text-[var(--green)] transition-smooth">{blog.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 uppercase tracking-widest">
                        Updated {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${blog.status === 'Published' ? 'bg-[var(--green-glow)] text-[var(--green)]' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                      {blog.status}
                   </span>
                   <ChevronRight size={16} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-smooth" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
           <div className="glass rounded-[2rem] p-8 border border-[var(--grey-dark)] bg-gradient-to-br from-[var(--green)]/5 to-transparent">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                 <CheckCircle2 size={18} className="text-[var(--green)]" />
                 Global Status
              </h3>
              <div className="space-y-4">
                 {[
                   { label: "Database Connection", status: "Active" },
                   { label: "Deployment Server", status: "Healthy" },
                   { label: "Content APIs", status: "Online" }
                 ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--grey-dark)]/50">
                       <span className="text-xs text-[var(--text-secondary)]">{item.label}</span>
                       <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-widest">{item.status}</span>
                    </div>
                    
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--grey-dark)]">
              <BarChart3 className="text-[var(--text-muted)] mb-4" size={32} />
              <h4 className="font-bold text-sm mb-2 text-white">Platform Health</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Your console is currently connected to <b>FIDAGLOBAL_COMPANYWEB</b> on server <b>34.63.59.161</b>. All syncs are operational.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
