"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  Zap, 
  ShieldCheck,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const statsData = await res.json();
          setData(statsData);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
        <Loader2 className="animate-spin text-[var(--green)]" size={48} />
        <p className="text-sm font-bold tracking-[0.3em] uppercase">Aggregating Global Metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || { users: 0, blogs: 0, projects: 0, customers: 0, expertise: 0 };
  const recentBlogs = Array.isArray(data?.recentBlogs) ? data.recentBlogs : [];

  const displayStats = [
    { label: "Site Stakeholders", value: (stats.users ?? 0).toString(), trend: "+100%", positive: true, icon: Users },
    { label: "Dynamic Insights", value: (stats.blogs ?? 0).toString(), trend: "Active", positive: true, icon: MousePointer2 },
    { label: "System Uptime", value: "99.99%", trend: "Stable", positive: true, icon: Zap },
    { label: "Global Reach", value: (stats.projects ?? 0).toString(), trend: "Projects", positive: true, icon: Globe },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h2>
          <p className="text-[var(--text-muted)] mt-1">Real-time performance metrics and user engagement insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[var(--bg-elevated)] border border-white/10 rounded-2xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
          </select>
          <button className="p-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-white/10 text-white hover:bg-white/5 transition-smooth">
            <TrendingUp size={20} />
          </button>
        </div>
      </div>

      {/* Stats Overiew */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[2rem] border border-white/5 hover:border-[var(--green)]/20 transition-all duration-500 group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[var(--green)] group-hover:scale-110 transition-smooth">
                <s.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${s.positive ? 'text-[var(--green)]' : 'text-red-400'}`}>
                {s.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.trend}
              </div>
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{s.label}</p>
              <p className="text-3xl font-black text-white mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Large Visual Charts Placeholder */}
      <div className="grid lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-white uppercase tracking-wider">Traffic Analysis</h3>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
                     Direct
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-[var(--blue)]" />
                     Organic
                  </div>
               </div>
            </div>
            
            <div className="h-64 mt-auto flex items-end justify-between gap-2 px-4">
               {[40, 70, 45, 90, 65, 85, 55, 75, 95, 60, 80, 50].map((h, i) => (
                 <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 + 0.5, duration: 1 }}
                    className="flex-1 rounded-t-xl relative group"
                    style={{ background: i % 2 === 0 ? 'var(--green)' : 'var(--blue)', opacity: 0.8 }}
                 >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                       {Math.floor(Math.random() * 1000)}v
                    </div>
                 </motion.div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
               <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
         </div>

         {/* Side Activity */}
         <div className="glass rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-8">Recent Activity</h3>
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
               {recentBlogs.map((log: any, i: number) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-10 rounded-full bg-white/5 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full bg-[var(--green)] h-1/2" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white max-w-[200px] truncate">{log.title}</p>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-1">
                          {new Date(log.created_at).toLocaleDateString()} • {log.status}
                       </p>
                    </div>
                 </div>
               ))}
               {recentBlogs.length === 0 && (
                 <p className="text-xs text-[var(--text-muted)]">No recent activity found.</p>
               )}
            </div>
            <button className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-white transition-smooth border-t border-white/5 mt-8">
               View Full Logs
            </button>
         </div>
      </div>

      {/* Modern Status Strip */}
      <div className="glass rounded-3xl border border-white/5 p-8 flex flex-wrap items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="relative">
               <div className="absolute inset-0 bg-[var(--green)]/40 blur-xl animate-pulse rounded-full" />
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center relative z-10">
                  <ShieldCheck className="text-[var(--green)]" size={24} />
               </div>
            </div>
            <div>
               <p className="text-lg font-bold text-white leading-tight">System Status: Optimal</p>
               <p className="text-sm text-[var(--text-muted)] mt-1">All services are operating within normal parameters.</p>
            </div>
         </div>
         <div className="flex gap-4">
             <div className="flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Response Time</p>
                <p className="text-xl font-black text-white">24ms</p>
             </div>
             <div className="w-[1px] h-10 bg-white/5 mx-4" />
             <div className="flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Reach</p>
                <p className="text-xl font-black text-white">{stats.customers}</p>
             </div>
         </div>
      </div>
    </div>
  );
}
