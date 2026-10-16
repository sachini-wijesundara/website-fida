"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Database,
  Briefcase,
  Loader2,
  MapPin,
  Clock,
  Edit2,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  EyeOff,
  X,
  Sparkles,
  FileText,
  Calendar,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CareerItem {
  id: number;
  title: string;
  dept: string;
  type: string;
  location: string;
  color: string;
  is_active: boolean;
  details?: string | null;
  posted_date?: string | null;
  deadline_date?: string | null;
  created_at: string;
}

const COLOR_OPTIONS = [
  { label: "Brand Blue", value: "#0047e1", preview: "bg-[#0047e1]" },
  { label: "Emerald Green", value: "#76c442", preview: "bg-[#76c442]" },
  { label: "Cyan", value: "#00a8e8", preview: "bg-[#00a8e8]" },
  { label: "Purple", value: "#a855f7", preview: "bg-[#a855f7]" },
  { label: "Amber", value: "#f59e0b", preview: "bg-[#f59e0b]" },
];

interface AdminDatePickerProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  align?: "left" | "right";
}

function AdminDatePicker({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
  align = "left",
}: AdminDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getInitialView = () => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  };

  const [viewDate, setViewDate] = useState(getInitialView);

  useEffect(() => {
    if (isOpen) {
      setViewDate(getInitialView());
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDateStr = (y: number, m: number, d: number) =>
    `${y}-${pad(m + 1)}-${pad(d)}`;

  const today = new Date();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewDate.year, viewDate.month, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push({
      day: daysInPrevMonth - i,
      month: viewDate.month === 0 ? 11 : viewDate.month - 1,
      year: viewDate.month === 0 ? viewDate.year - 1 : viewDate.year,
      isCurrentMonth: false,
    });
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      day: i,
      month: viewDate.month,
      year: viewDate.year,
      isCurrentMonth: true,
    });
  }

  const totalCells = prevMonthDays.length + currentMonthDays.length <= 35 ? 35 : 42;
  const nextMonthDaysCount = totalCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push({
      day: i,
      month: viewDate.month === 11 ? 0 : viewDate.month + 1,
      year: viewDate.month === 11 ? viewDate.year + 1 : viewDate.year,
      isCurrentMonth: false,
    });
  }

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  return (
    <div className="relative" ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-widest text-blue-500 mb-2 flex items-center gap-1.5 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {icon}
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly
          value={value}
          onClick={() => setIsOpen((prev) => !prev)}
          placeholder={placeholder}
          className="w-full rounded-2xl pl-5 pr-14 py-3.5 bg-white/95 border border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-[#052c65] transition-all text-sm cursor-pointer shadow-sm placeholder:text-slate-400 font-medium"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center"
          title="Open calendar"
          aria-label="Open calendar"
        >
          {icon}
        </button>
      </div>

      {value && (
        <p className="mt-1.5 text-[11px] text-slate-500 pl-1 font-medium">
          {new Date(value + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-[calc(100%+8px)] z-50 w-72 sm:w-80 p-4 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-sky-950/15 ${
              align === "right" ? "left-0 md:left-auto md:right-0" : "left-0"
            }`}
          >
            {/* Header: Month & Year navigation */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="font-bold text-[#052c65] text-sm tracking-tight flex items-center gap-1.5">
                <span>{MONTH_NAMES[viewDate.month]}</span>
                <span className="text-blue-600">{viewDate.year}</span>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {WEEK_DAYS.map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-bold text-sky-600/75 uppercase tracking-wider py-1"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar days grid */}
            <div className="grid grid-cols-7 gap-1">
              {allDays.map((item, idx) => {
                const dateStr = formatDateStr(item.year, item.month, item.day);
                const isSelected = value === dateStr;
                const isCurrentDay = todayStr === dateStr;

                return (
                  <button
                    key={`${item.year}-${item.month}-${item.day}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(dateStr);
                      setIsOpen(false);
                    }}
                    className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto flex items-center justify-center text-xs rounded-xl font-medium transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 scale-105"
                        : isCurrentDay
                        ? "ring-2 ring-blue-500 text-blue-600 font-bold bg-blue-50/60 hover:bg-blue-100/70"
                        : item.isCurrentMonth
                        ? "text-[#052c65] hover:bg-blue-50 hover:text-blue-600"
                        : "text-slate-300 hover:bg-slate-50 hover:text-slate-400"
                    }`}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>

            {/* Footer action buttons */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 px-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                  setIsOpen(false);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(todayStr);
                  setViewDate({ year: today.getFullYear(), month: today.getMonth() });
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-blue-50"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareersAdminPanel() {
  const [jobs, setJobs] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Edit / Create Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CareerItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    dept: "",
    type: "Full-time",
    location: "",
    color: "#0047e1",
    is_active: true,
    details: "",
    posted_date: "",
    deadline_date: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/careers", { cache: "no-store" });
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setForm({
      title: "",
      dept: "",
      type: "Full-time",
      location: "",
      color: "#0047e1",
      is_active: true,
      details: "",
      posted_date: "",
      deadline_date: "",
    });
    setShowForm(true);
  };

  const openEditForm = (item: CareerItem) => {
    setEditingItem(item);
    const resolvedColor =
      item.color && !item.color.startsWith("var(")
        ? item.color
        : item.color === "var(--green)"
        ? "#76c442"
        : "#0047e1";

    setForm({
      title: item.title || "",
      dept: item.dept || "",
      type: item.type || "Full-time",
      location: item.location || "",
      color: resolvedColor,
      is_active: item.is_active !== false,
      details: item.details || "",
      posted_date: item.posted_date ? item.posted_date.slice(0, 10) : "",
      deadline_date: item.deadline_date ? item.deadline_date.slice(0, 10) : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dept.trim() || !form.location.trim()) {
      alert("Please fill in all required fields (Title, Department, Location).");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // UPDATE existing job
        const res = await fetch("/api/admin/careers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            ...form,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to update job");
        }
      } else {
        // CREATE new job
        const res = await fetch("/api/admin/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to create job");
        }
      }

      handleCloseForm();
      await fetchJobs();
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err.message || "An error occurred while saving the job.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: CareerItem) => {
    setTogglingId(item.id);
    const nextStatus = !item.is_active;
    try {
      const res = await fetch("/api/admin/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          is_active: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      setJobs((prev) =>
        prev.map((j) => (j.id === item.id ? { ...j, is_active: nextStatus } : j))
      );
    } catch (err: any) {
      console.error("Toggle error:", err);
      alert(err.message || "Failed to update job status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this job posting?")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete job");
      }
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete job posting.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      job.title?.toLowerCase().includes(query) ||
      job.dept?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (job.is_active === true || job.is_active as any === 1)) ||
      (statusFilter === "inactive" && (job.is_active === false || job.is_active as any === 0));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-6xl w-full mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-blue-400" size={34} />
            Manage Careers
          </h1>
          <p className="text-[var(--text-muted)] mt-1.5 text-sm">
            Publish, edit, and manage job openings across the FIDA Global platform.
          </p>
        </div>
        <button
          onClick={showForm ? handleCloseForm : openCreateForm}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all self-start sm:self-auto ${
            showForm
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          }`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Publish New Job"}
        </button>
      </div>

      {/* Add / Edit Form Modal / Collapsible */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="overflow-visible"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border)] mb-8 shadow-2xl relative">
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingItem ? (
                    <Edit2 size={20} className="text-blue-400" />
                  ) : (
                    <Plus size={20} className="text-blue-400" />
                  )}
                  {editingItem ? "Edit Job Posting" : "Publish New Job"}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                      Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Senior Cloud Engineer"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-2xl px-5 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20 text-sm"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                      Department <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Infrastructure / Engineering"
                      value={form.dept}
                      onChange={(e) => setForm({ ...form, dept: e.target.value })}
                      className="w-full rounded-2xl px-5 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20 text-sm"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                      Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Colombo, Sri Lanka / Remote"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-2xl px-5 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20 text-sm"
                    />
                  </div>

                  {/* Type & Color row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                        Employment Type
                      </label>
                      <select
                        required
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full rounded-2xl px-4 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                        Accent Color
                      </label>
                      <select
                        required
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full rounded-2xl px-4 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                      >
                        {COLOR_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Posting Date & Deadline row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminDatePicker
                    id="posted_date"
                    label="Job Posting Date"
                    icon={<Calendar size={15} />}
                    value={form.posted_date}
                    onChange={(val) => setForm({ ...form, posted_date: val })}
                    align="left"
                  />

                  <AdminDatePicker
                    id="deadline_date"
                    label="Final Submission Date"
                    icon={<CalendarClock size={15} />}
                    value={form.deadline_date}
                    onChange={(val) => setForm({ ...form, deadline_date: val })}
                    align="right"
                  />
                </div>

                {/* Details / Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                    Job Description & Responsibilities (Optional)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe key responsibilities, requirements, and qualifications for this role..."
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className="w-full rounded-2xl px-5 py-3.5 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20 text-sm leading-relaxed"
                  />
                </div>

                {/* Status Toggle & Submit */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-white">
                      Active (Visible on public Careers page)
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-6 py-3 rounded-full text-white/60 hover:text-white bg-white/5 hover:bg-white/10 font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={saving || !form.title.trim() || !form.dept.trim() || !form.location.trim()}
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 text-sm"
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Database size={16} />
                      )}
                      {saving
                        ? "Saving..."
                        : editingItem
                        ? "Update Job Posting"
                        : "Publish Job Post"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search jobs by title, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full pl-11 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/30"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--bg-elevated)] p-1 rounded-full border border-[var(--border)]">
          {(["all", "active", "inactive"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Database Listing Table */}
      <div className="rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--bg-elevated)] backdrop-blur-md shadow-2xl relative">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-3 text-blue-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Loading careers...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Briefcase size={32} className="text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {jobs.length === 0 ? "No Active Job Posts" : "No Matching Openings Found"}
              </h3>
              <p className="text-[var(--text-muted)] max-w-sm text-sm">
                {jobs.length === 0
                  ? "The careers listing is empty. Publish open positions to attract top talent."
                  : "Try clearing your search query or switching your status filter."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    Job Title & Department
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    Location & Type
                  </th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredJobs.map((job) => {
                  const resolvedColor =
                    job.color && !job.color.startsWith("var(")
                      ? job.color
                      : job.color === "var(--green)"
                      ? "#76c442"
                      : "#0047e1";

                  const isActive = job.is_active === true || (job.is_active as any) === 1;

                  return (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Job Title & Dept */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-2 h-10 rounded-full shrink-0"
                            style={{ backgroundColor: resolvedColor }}
                          />
                          <div>
                            <div className="font-bold text-white text-[15px] group-hover:text-blue-400 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
                              {job.dept} · Added:{" "}
                              {new Date(job.created_at).toLocaleDateString()}
                            </div>
                            {job.details && job.details.trim() && (
                              <div className="text-[11px] text-white/50 mt-1.5 flex items-center gap-1.5 max-w-md">
                                <FileText size={12} className="text-blue-400 shrink-0" />
                                <span className="truncate">{job.details}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location & Type */}
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-1.5 text-xs text-white/80">
                            <MapPin size={13} className="text-blue-400" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-white/80">
                            <Clock size={13} className="text-emerald-400" /> {job.type}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="px-6 py-6 text-center">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          disabled={togglingId === job.id}
                          title={isActive ? "Click to Deactivate" : "Click to Activate"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                          } disabled:opacity-50`}
                        >
                          {togglingId === job.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isActive ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Action buttons (Edit & Delete) */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Toggle Visiblity */}
                          <button
                            title={isActive ? "Hide from public site" : "Show on public site"}
                            onClick={() => handleToggleStatus(job)}
                            disabled={togglingId === job.id}
                            className="p-2 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10 disabled:opacity-50"
                          >
                            {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>

                          {/* Edit */}
                          <button
                            title="Edit Job"
                            onClick={() => openEditForm(job)}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all border border-transparent hover:border-blue-500/20"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            title="Delete Job"
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingId === job.id}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400/80 hover:bg-red-500/20 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
                          >
                            {deletingId === job.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
