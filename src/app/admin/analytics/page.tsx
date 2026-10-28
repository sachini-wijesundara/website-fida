"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Eye,
  Clock,
  MousePointerClick,
  TrendingUp,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Compass,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Target,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KpiData {
  totalSessions: number;
  uniqueVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  avgScrollPercent: number;
}

interface TimelineItem {
  date: string;
  sessions: number;
  visitors: number;
}

interface TopPageItem {
  page_path: string;
  views: number;
  unique_sessions: number;
  avg_duration: number;
  avg_scroll: number;
}

interface ScrollFunnelData {
  total_views: number;
  scroll_25: number | null;
  scroll_50: number | null;
  scroll_75: number | null;
  scroll_90: number | null;
}

interface LeadBreakdown {
  scrollScore: number;
  dwellScore: number;
  intentScore: number;
  breadthScore: number;
}

interface LeadInfo {
  score: number;
  category: "hot" | "warm" | "cold";
  label: string;
  badge: string;
  maxScroll: number;
  breakdown: LeadBreakdown;
}

interface InquiryFunnelStep {
  label: string;
  count: number;
  pct: number;
  dropOffPct?: number;
}

interface InquiryFunnel {
  step1: InquiryFunnelStep;
  step2: InquiryFunnelStep;
  step3: InquiryFunnelStep;
}

interface LeadStats {
  hotCount: number;
  warmCount: number;
  coldCount: number;
}

interface DistributionItem {
  device?: string;
  name?: string;
  country?: string;
  count: number;
}

interface RecentPageItem {
  view_id: string;
  page_path: string;
  page_title?: string;
  duration_seconds: number;
  max_scroll_percent: number;
  entered_at: string;
}

interface RecentSessionItem {
  session_id: string;
  visitor_id: string;
  ip_country: string | null;
  ip_city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  landing_page: string | null;
  total_duration: number;
  started_at: string;
  page_count: number;
  pages: RecentPageItem[];
  lead?: LeadInfo;
}

interface SectionItem {
  section_id: string;
  total_views: number;
  avg_time: number;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.round(seconds % 60);
  if (mins < 60) {
    return `${mins}m ${remainingSecs > 0 ? `${remainingSecs}s` : ""}`.trim();
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<string>("7d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedSessionIds, setExpandedSessionIds] = useState<Record<string, boolean>>({});

  const toggleSession = (id: string) => {
    setExpandedSessionIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchAnalytics = useCallback(async (selectedRange: string, isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const kpi: KpiData = data?.kpi || {
    totalSessions: 0,
    uniqueVisitors: 0,
    totalPageViews: 0,
    avgSessionDuration: 0,
    avgScrollPercent: 0,
  };

  const timeline: TimelineItem[] = data?.timeline || [];
  const topPages: TopPageItem[] = data?.topPages || [];
  const scrollFunnel: ScrollFunnelData = data?.scrollFunnel || {
    total_views: 0,
    scroll_25: 0,
    scroll_50: 0,
    scroll_75: 0,
    scroll_90: 0,
  };
  const devices: DistributionItem[] = data?.devices || [];
  const browsers: DistributionItem[] = data?.browsers || [];
  const operatingSystems: DistributionItem[] = data?.operatingSystems || [];
  const countries: DistributionItem[] = data?.countries || [];
  const recentSessions: RecentSessionItem[] = data?.recentSessions || [];
  const topSections: SectionItem[] = data?.topSections || [];
  const leadStats: LeadStats = data?.leadStats || { hotCount: 0, warmCount: 0, coldCount: 0 };
  const inquiryFunnel: InquiryFunnel = data?.inquiryFunnel || {
    step1: { label: "Homepage Landing (/)", count: 0, pct: 100 },
    step2: { label: "Offerings Discovery", count: 0, pct: 0, dropOffPct: 0 },
    step3: { label: "High-Intent Action", count: 0, pct: 0, dropOffPct: 0 },
  };
  const [leadFilter, setLeadFilter] = useState<"all" | "hot" | "warm" | "cold">("all");

  const filteredSessions = recentSessions.filter((s) => {
    if (leadFilter === "all") return true;
    return s.lead?.category === leadFilter;
  });

  const totalScrollViews = Math.max(1, scrollFunnel.total_views || 1);
  const s25Pct = Math.round(((scrollFunnel.scroll_25 || 0) / totalScrollViews) * 100);
  const s50Pct = Math.round(((scrollFunnel.scroll_50 || 0) / totalScrollViews) * 100);
  const s75Pct = Math.round(((scrollFunnel.scroll_75 || 0) / totalScrollViews) * 100);
  const s90Pct = Math.round(((scrollFunnel.scroll_90 || 0) / totalScrollViews) * 100);

  const totalDeviceCount = devices.reduce((acc, d) => acc + (d.count || 0), 0) || 1;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
        <Loader2 className="animate-spin text-[var(--green)]" size={48} />
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/70">
          Aggregating Real-Time Visitor Telemetry...
        </p>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Unique Visitors",
      value: kpi.uniqueVisitors.toLocaleString(),
      subtext: "Distinct visitor devices",
      icon: Users,
      color: "var(--green)",
    },
    {
      label: "Total Sessions",
      value: kpi.totalSessions.toLocaleString(),
      subtext: "Browse sessions recorded",
      icon: Compass,
      color: "#3b82f6",
    },
    {
      label: "Page Views",
      value: kpi.totalPageViews.toLocaleString(),
      subtext: "Total pages navigated",
      icon: Eye,
      color: "#8b5cf6",
    },
    {
      label: "Avg. Dwell Time",
      value: formatDuration(kpi.avgSessionDuration),
      subtext: `Avg Scroll: ${Math.round(kpi.avgScrollPercent)}%`,
      icon: Clock,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Visitor Analytics</h2>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Real-time visitor journeys, scroll depths, active dwell times, and section engagement.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--bg-elevated)] border border-white/10 rounded-2xl p-1 text-xs font-semibold">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "12m", label: "12 Months" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  range === tab.id
                    ? "bg-[var(--green)] text-black font-bold shadow-md shadow-[var(--green)]/20"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(range, true)}
            title="Refresh analytics data"
            className="p-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin text-[var(--green)]" : ""} />
          </button>
        </div>
      </div>

      {/* ── 4 Main KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass p-6 rounded-[2rem] border border-white/5 hover:border-[var(--green)]/30 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${card.color}15`,
                  borderColor: `${card.color}35`,
                  color: card.color,
                }}
              >
                <card.icon size={22} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <ArrowUpRight size={14} /> Active
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {card.label}
              </p>
              <p className="text-3xl font-black text-white mt-1 tracking-tight">{card.value}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-medium">{card.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Middle Row: Traffic Timeline & Scroll Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Over Time */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={18} className="text-[var(--green)]" />
                Traffic Timeline
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Sessions vs. unique visitors</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-white/80">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)]" />
                Sessions
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Visitors
              </div>
            </div>
          </div>

          {timeline.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-3 px-2 pt-6">
              {timeline.map((item, idx) => {
                const maxSession = Math.max(...timeline.map((t) => t.sessions), 1);
                const sHeight = Math.max(12, Math.round((item.sessions / maxSession) * 100));
                const vHeight = Math.max(8, Math.round((item.visitors / maxSession) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/20 px-2.5 py-1.5 rounded-xl text-[10px] text-white shadow-xl pointer-events-none whitespace-nowrap z-20">
                      <p className="font-bold">{item.date}</p>
                      <p className="text-emerald-400">{item.sessions} sessions</p>
                      <p className="text-blue-400">{item.visitors} visitors</p>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${sHeight}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.03 }}
                        className="w-1/2 max-w-[18px] rounded-t-md bg-[var(--green)] opacity-90 group-hover:opacity-100"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${vHeight}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.03 + 0.1 }}
                        className="w-1/2 max-w-[18px] rounded-t-md bg-blue-500 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-2 font-mono truncate max-w-full">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl">
              <Calendar size={36} className="text-white/20 mb-2" />
              <p className="text-sm font-semibold text-white/80">No traffic data recorded in this range</p>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                New visits will automatically appear here as visitors browse the website.
              </p>
            </div>
          )}
        </div>

        {/* Scroll Depth Funnel */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MousePointerClick size={18} className="text-amber-400" />
              Scroll Depth Funnel
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">How far visitors scroll on pages</p>
          </div>

          <div className="space-y-4 my-6">
            {[
              { label: "Top 25% of Page", pct: s25Pct, count: scrollFunnel.scroll_25 || 0, color: "bg-emerald-400" },
              { label: "Halfway (50%)", pct: s50Pct, count: scrollFunnel.scroll_50 || 0, color: "bg-blue-400" },
              { label: "Deep Scroll (75%)", pct: s75Pct, count: scrollFunnel.scroll_75 || 0, color: "bg-purple-400" },
              { label: "Full Page (90%+)", pct: s90Pct, count: scrollFunnel.scroll_90 || 0, color: "bg-amber-400" },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">{step.label}</span>
                  <span className="font-mono text-white/70">
                    {step.count} views ({step.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.pct}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${step.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] italic text-center">
            Drop-off indicates where readers disengage before reaching bottom CTAs.
          </p>
        </div>
      </div>

      {/* ── Conversion Funnel & Lead Intent Intelligence ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commercial Inquiry Funnel */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                Inquiry & Conversion Funnel
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Path from Homepage → Offerings Discovery → High-Intent Conversion
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {inquiryFunnel.step3.pct}% Conversion
            </span>
          </div>

          <div className="space-y-4 my-6">
            {/* Step 1 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                  <span className="font-semibold text-white">Homepage Landing</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">(/)</span>
                </div>
                <span className="font-mono text-white/80 font-bold">{inquiryFunnel.step1.count} sessions (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Drop-off connector */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
              <span>↓</span>
              <span>{inquiryFunnel.step2.dropOffPct}% drop-off</span>
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                  <span className="font-semibold text-white">Solutions & Offerings Discovery</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">(/services, /solutions)</span>
                </div>
                <span className="font-mono text-white/80 font-bold">{inquiryFunnel.step2.count} sessions ({inquiryFunnel.step2.pct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min(100, inquiryFunnel.step2.pct)}%` }} />
              </div>
            </div>

            {/* Drop-off connector */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
              <span>↓</span>
              <span>{inquiryFunnel.step3.dropOffPct}% drop-off</span>
            </div>

            {/* Step 3 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                  <span className="font-semibold text-white">High-Intent Conversion</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">(/contact, /careers)</span>
                </div>
                <span className="font-mono text-white/80 font-bold">{inquiryFunnel.step3.count} sessions ({inquiryFunnel.step3.pct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, inquiryFunnel.step3.pct)}%` }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] italic text-center">
            Multi-page progression from initial entry to sales and inquiry interest.
          </p>
        </div>

        {/* Lead Intent Scoring Overview */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame size={18} className="text-rose-400" />
                Lead Intent Intelligence
              </h3>
              <span className="text-xs text-[var(--text-muted)] font-mono">0 – 100 Scale</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Automated visitor intent scoring based on dwell time, 90%+ scroll depth, commercial pages, and breadth
            </p>
          </div>

          {/* 3 Lead Category Summary Badges */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-xs">
                <Flame size={14} /> Hot Leads
              </div>
              <p className="text-2xl font-black text-white mt-1.5 font-mono">{leadStats.hotCount}</p>
              <p className="text-[10px] text-rose-300/80 mt-1 font-medium">Score ≥ 70</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs">
                <Zap size={14} /> Warm
              </div>
              <p className="text-2xl font-black text-white mt-1.5 font-mono">{leadStats.warmCount}</p>
              <p className="text-[10px] text-amber-300/80 mt-1 font-medium">Score 40 – 69</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 font-bold text-xs">
                ❄️ Casual
              </div>
              <p className="text-2xl font-black text-white mt-1.5 font-mono">{leadStats.coldCount}</p>
              <p className="text-[10px] text-slate-400/80 mt-1 font-medium">Score &lt; 40</p>
            </div>
          </div>

          {/* Criteria breakdown note */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Scoring Weight Distribution:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
              <div className="flex items-center justify-between">
                <span>⏱️ Active Dwell Time</span>
                <span className="font-mono text-emerald-400 font-bold">Max 35 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📜 Scroll Reach (90%+)</span>
                <span className="font-mono text-emerald-400 font-bold">Max 25 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🎯 High-Intent Pages</span>
                <span className="font-mono text-emerald-400 font-bold">Max 25 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 Multi-Page Breadth</span>
                <span className="font-mono text-emerald-400 font-bold">Max 15 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Visited Pages & Engagement Table ── */}
      <div className="glass rounded-[2.5rem] border border-white/5 p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-blue-400" />
              Top Visited Pages & Engagement
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Views, dwell duration, and average scroll reach per page
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Showing top {topPages.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[var(--text-muted)] uppercase tracking-wider">
                <th className="pb-3 font-bold">Page Path</th>
                <th className="pb-3 font-bold text-right">Page Views</th>
                <th className="pb-3 font-bold text-right">Unique Sessions</th>
                <th className="pb-3 font-bold text-right">Avg Dwell Time</th>
                <th className="pb-3 font-bold text-right">Avg Scroll</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topPages.map((page, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 pr-4 font-mono font-bold text-white group-hover:text-[var(--green)] transition-colors">
                    {page.page_path}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white/80">
                    {page.unique_sessions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                    {formatDuration(page.avg_duration)}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <div className="inline-flex items-center gap-2 font-mono text-white/80">
                      <span>{Math.round(page.avg_scroll)}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--green)]"
                          style={{ width: `${Math.min(100, Math.round(page.avg_scroll))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[var(--text-muted)]">
                    No page navigation data recorded yet for this time window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Visitor Journeys & Exact Page Trails Explorer ── */}
      <div className="glass rounded-[2.5rem] border border-white/5 p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass size={18} className="text-emerald-400" />
              Visitor Journeys & Page Trails
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Inspect each individual visitor: total pages visited, exact sequential path, dwell times, and lead intent score
            </p>
          </div>

          {/* Lead Category Filter Buttons */}
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-white/10 rounded-2xl p-1 text-xs font-semibold">
            <button
              onClick={() => setLeadFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                leadFilter === "all"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              All ({recentSessions.length})
            </button>
            <button
              onClick={() => setLeadFilter("hot")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                leadFilter === "hot"
                  ? "bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25"
                  : "text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              <Flame size={13} />
              Hot ({leadStats.hotCount})
            </button>
            <button
              onClick={() => setLeadFilter("warm")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                leadFilter === "warm"
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/25"
                  : "text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              <Zap size={13} />
              Warm ({leadStats.warmCount})
            </button>
            <button
              onClick={() => setLeadFilter("cold")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                leadFilter === "cold"
                  ? "bg-slate-600 text-white font-bold shadow-md"
                  : "text-slate-400 hover:bg-slate-500/10"
              }`}
            >
              Casual ({leadStats.coldCount})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSessions.map((session, idx) => {
            const isExpanded = Boolean(expandedSessionIds[session.session_id]);
            const pages = session.pages || [];
            const pageCount = session.page_count || pages.length;
            const lead = session.lead;

            const leadBadgeStyle =
              lead?.category === "hot"
                ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                : lead?.category === "warm"
                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                : "bg-slate-500/15 border-slate-500/30 text-slate-300";

            return (
              <div
                key={session.session_id || idx}
                className="rounded-2xl border border-white/5 bg-white/[0.015] hover:border-white/10 transition-all overflow-hidden"
              >
                {/* Main Journey Summary Bar */}
                <div
                  onClick={() => toggleSession(session.session_id)}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  {/* Left: Visitor ID, Lead Badge & Tech Info */}
                  <div className="space-y-1.5 min-w-[240px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">
                        {session.visitor_id.slice(0, 16)}...
                      </span>
                      {lead && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${leadBadgeStyle}`}>
                          {lead.category === "hot" && <Flame size={11} />}
                          {lead.category === "warm" && <Zap size={11} />}
                          {lead.category === "cold" && <span>❄️</span>}
                          {lead.badge} ({lead.score}/100)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        📍 {session.ip_city ? `${session.ip_country || "Sri Lanka"}, ${session.ip_city}` : (session.ip_country || "Sri Lanka")}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {session.device_type || "desktop"} • {session.browser || "Browser"} • {timeAgo(session.started_at)}
                      </span>
                    </div>
                  </div>

                  {/* Center: Total Pages & Trail Badges */}
                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold whitespace-nowrap">
                      {pageCount} {pageCount === 1 ? "page" : "pages"} visited
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                      {pages.map((p, pIdx) => (
                        <React.Fragment key={p.view_id || pIdx}>
                          <span className="px-2 py-1 rounded-lg bg-white/5 text-white/90 border border-white/5 flex items-center gap-1.5">
                            <span className="text-[10px] text-white/40">{pIdx + 1}.</span>
                            <span className="font-semibold text-emerald-400">{p.page_path}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">({formatDuration(p.duration_seconds)})</span>
                          </span>
                          {pIdx < pages.length - 1 && (
                            <span className="text-white/30 text-xs">→</span>
                          )}
                        </React.Fragment>
                      ))}
                      {pages.length === 0 && (
                        <span className="text-xs text-[var(--text-muted)]">Entry: {session.landing_page || "/"}</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Duration & Expand Toggle */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">
                        {formatDuration(session.total_duration)}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Session</p>
                    </div>
                    <button
                      type="button"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                      aria-label="Toggle visitor page trail"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Page Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/5 bg-black/20 p-5 space-y-4"
                    >
                      {/* Lead Score Breakdown Banner */}
                      {lead && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-white">
                                Lead Intent Score:
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${leadBadgeStyle}`}>
                                {lead.score}/100 — {lead.label}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                              Peak Scroll: {Math.round(lead.maxScroll)}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                              <span className="text-[10px] text-[var(--text-muted)] block">Scroll Reach</span>
                              <span className="font-bold text-white">{lead.breakdown.scrollScore}/25 pts</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                              <span className="text-[10px] text-[var(--text-muted)] block">Dwell Duration</span>
                              <span className="font-bold text-white">{lead.breakdown.dwellScore}/35 pts</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                              <span className="text-[10px] text-[var(--text-muted)] block">High-Value Pages</span>
                              <span className="font-bold text-white">{lead.breakdown.intentScore}/25 pts</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                              <span className="text-[10px] text-[var(--text-muted)] block">Browsing Breadth</span>
                              <span className="font-bold text-white">{lead.breakdown.breadthScore}/15 pts</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Chronological Page Journey ({pages.length} total pages):
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pages.map((p, pIdx) => (
                          <div
                            key={p.view_id || pIdx}
                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 font-bold text-[10px] font-mono">
                                Step {pIdx + 1}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                                {formatDuration(p.duration_seconds)} dwell
                              </span>
                            </div>
                            <div>
                              <p className="font-mono font-bold text-white text-sm truncate">{p.page_path}</p>
                              {p.page_title && (
                                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1 italic">
                                  &ldquo;{p.page_title}&rdquo;
                                </p>
                              )}
                            </div>
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] text-white/70">
                                <span>Scroll Reach</span>
                                <span className="font-bold text-emerald-400">{Math.round(p.max_scroll_percent)}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[var(--green)]"
                                  style={{ width: `${Math.min(100, Math.round(p.max_scroll_percent))}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="text-center py-10 text-xs text-[var(--text-muted)] border border-dashed border-white/10 rounded-2xl">
              No visitor journeys match the &ldquo;{leadFilter}&rdquo; filter in this time window.
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Grid: Device Distribution, Browsers & Live Sessions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device & Browser Tech Stack */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Monitor size={18} className="text-purple-400" />
              Devices & Platforms
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Visitor hardware & screen categories</p>
          </div>

          {/* Device Type Bars */}
          <div className="space-y-3.5 my-6">
            {["desktop", "mobile", "tablet"].map((type) => {
              const match = devices.find((d) => (d.device || "").toLowerCase() === type);
              const count = match ? match.count : 0;
              const pct = Math.round((count / totalDeviceCount) * 100);
              const Icon = type === "mobile" ? Smartphone : type === "tablet" ? Tablet : Monitor;

              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 capitalize text-white/90 font-semibold">
                      <Icon size={14} className="text-[var(--green)]" />
                      {type}
                    </div>
                    <span className="font-mono text-white/70">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--green)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browsers & OS Lists */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Top Browsers
            </p>
            <div className="flex flex-wrap gap-2">
              {browsers.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] font-semibold text-white/90"
                >
                  {b.name || "Other"} ({b.count})
                </span>
              ))}
              {browsers.length === 0 && (
                <span className="text-xs text-[var(--text-muted)]">No browser data yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Section Engagement */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe size={18} className="text-emerald-400" />
              Section Visibility
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Which page blocks get the most screen time</p>
          </div>

          <div className="space-y-3.5 my-6 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
            {topSections.map((sec, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white font-mono">{sec.section_id}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-semibold">
                    {sec.total_views} visitors viewed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {formatDuration(sec.avg_time)}
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Avg View</p>
                </div>
              </div>
            ))}
            {topSections.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] text-center">
                No section interactions recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Geographic Origins
            </p>
            <div className="flex flex-wrap gap-2">
              {countries.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] font-semibold text-white/90"
                >
                  {c.country || "Other"} ({c.count})
                </span>
              ))}
              {countries.length === 0 && (
                <span className="text-xs text-[var(--text-muted)]">No country data yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Visitor Sessions Stream */}
        <div className="glass rounded-[2.5rem] border border-white/5 p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                Recent Sessions
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Live visitor activity stream</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3.5 my-6 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
            {recentSessions.map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate max-w-[150px]">
                      {s.landing_page || "/"}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-[var(--text-muted)]">
                      {s.device_type || "desktop"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 truncate">
                    {s.browser || "Browser"} • {s.os || "OS"} • 📍 {s.ip_city ? `${s.ip_country || "Sri Lanka"}, ${s.ip_city}` : (s.ip_country || "Sri Lanka")}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-emerald-400 text-xs">
                    {formatDuration(s.total_duration)}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{timeAgo(s.started_at)}</p>
                </div>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)] text-center">
                Waiting for incoming visitor sessions...
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Status: Connected</span>
            <span className="font-semibold text-emerald-400">All services active</span>
          </div>
        </div>
      </div>

      {/* ── Status Strip ── */}
      <div className="glass rounded-3xl border border-white/5 p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-tight">Privacy-First Tracking Active</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Strictly adheres to GDPR cookie consent, filters bots, and avoids PII storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono">
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Sessions</p>
            <p className="text-lg font-black text-white mt-0.5">{kpi.totalSessions.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Page Views</p>
            <p className="text-lg font-black text-white mt-0.5">{kpi.totalPageViews.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
