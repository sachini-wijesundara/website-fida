"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Mail, 
  Clock, 
  User, 
  Building, 
  CheckCircle2,
  Loader2,
  Send,
  X,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerLeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Reply modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/admin/customer-leads");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setLeads(list);
        if (list.length > 0 && !selected) {
          setSelected(list[0]);
        }
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error("Fetch leads error:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this customer lead?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/customer-leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((item) => item.id !== id));
        if (selected?.id === id) {
          const remaining = leads.filter((item) => item.id !== id);
          setSelected(remaining.length > 0 ? remaining[0] : null);
        }
        showToast("Lead deleted successfully");
      } else {
        alert("Failed to delete lead. Please try again.");
      }
    } catch {
      alert("Network error while deleting lead.");
    } finally {
      setDeletingId(null);
    }
  }

  function openReplyModal(lead: any) {
    const defaultSubject = `Regarding ${lead.service || "your message"} - FIDA Global`;
    const defaultBody = `Dear ${lead.name || "Valued Client"},\n\nThank you for reaching out to FIDA Global regarding ${lead.service || "our services"}.\n\n`;
    setReplySubject(defaultSubject);
    setReplyMessage(defaultBody);
    setReplyModalOpen(true);
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !selected.email) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/customer-leads/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.email,
          name: selected.name,
          subject: replySubject,
          message: replyMessage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReplyModalOpen(false);
        showToast(`Reply sent successfully to ${selected.email}!`);
      } else {
        alert(data.message || "Failed to send email reply.");
      }
    } catch {
      alert("Network error while dispatching email reply.");
    } finally {
      setSendingReply(false);
    }
  }

  function handleCopyEmail(email: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      showToast("Email address copied to clipboard!");
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const safeLeads = Array.isArray(leads) ? leads : [];
  const filtered = safeLeads.filter((i) =>
    (i?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (i?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (i?.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (i?.service?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (i?.message?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 right-8 z-[1000] bg-white px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(5,44,101,0.2)] flex items-center gap-3 border border-emerald-500/40 text-sm font-bold"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <span style={{ color: "#0f172a" }} className="font-bold">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#052c65] tracking-tight">Customer Leads</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage incoming customer leads and respond directly to prospective clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by name, email..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Leads List on Left & Detailed View on Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Leads List */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[76vh] overflow-y-auto custom-scrollbar pr-1">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#0047e1]">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Leads...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-slate-200 space-y-2">
              <Inbox size={36} className="text-slate-300 mx-auto mb-1" />
              <p className="text-slate-700 font-bold text-sm">No customer leads found</p>
              <p className="text-xs text-slate-400">
                {searchTerm ? "Try searching with a different keyword." : "Incoming customer leads from the website will appear here."}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selected?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden bg-white ${
                    isSelected
                      ? "border-[#0047e1] shadow-md shadow-blue-500/10 ring-1 ring-[#0047e1]"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Active indicator bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0047e1]" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047e1] flex items-center justify-center shrink-0 font-bold text-sm">
                      {item.name ? item.name.charAt(0).toUpperCase() : <User size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-[#052c65] text-sm truncate">{item.name}</h3>
                        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block text-[11px] font-semibold text-[#0047e1] bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                          {item.service || "Customer Lead"}
                        </span>
                        {item.company && (
                          <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                            &bull; {item.company}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Lead Detailed View */}
        <div className="lg:col-span-7">
          {selected ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-9 relative flex flex-col space-y-6">
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#052c65] tracking-tight">{selected.name}</h3>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Email capsule */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                      <Mail size={13} className="text-[#0047e1]" />
                      <span>{selected.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(selected.email)}
                        className="text-slate-400 hover:text-[#0047e1] transition-colors p-0.5 ml-0.5"
                        title="Copy email"
                      >
                        {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>

                    {/* Company capsule */}
                    {selected.company && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                        <Building size={13} className="text-[#167fa8]" />
                        <span>{selected.company}</span>
                      </div>
                    )}

                    {/* Service tag */}
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100/70 text-[#0047e1] text-[11px] font-bold tracking-wide uppercase">
                      {selected.service || "Customer Lead"}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  disabled={deletingId === selected.id}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  title="Delete this lead"
                >
                  {deletingId === selected.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>

              {/* Product Specific Info (e.g. for Smart HRIS inquiries) */}
              {selected.service === "Smart HRIS" && (
                <div className="grid grid-cols-3 gap-4 p-5 bg-blue-50/60 rounded-2xl border border-blue-100/80 text-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0047e1] mb-1">Employees</p>
                    <p className="text-lg font-black text-[#052c65]">{selected.employee_count || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0047e1] mb-1">Hierarchy</p>
                    <p className="text-lg font-black text-[#052c65]">{selected.division_status || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0047e1] mb-1">Companies</p>
                    <p className="text-lg font-black text-[#052c65]">{selected.company_count || "N/A"}</p>
                  </div>
                </div>
              )}

              {/* Time Received */}
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Clock size={14} className="text-slate-400" />
                <span>
                  Received {selected.created_at ? new Date(selected.created_at).toLocaleString() : "Recently"}
                </span>
              </div>

              {/* Message Content Box (Clean, without overlapping icon bugs) */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Content</p>
                <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {selected.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {/* ✉ Direct Reply Button - Opens In-App Email Reply Modal */}
                <button
                  type="button"
                  onClick={() => openReplyModal(selected)}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 cursor-pointer text-sm"
                >
                  <Mail size={17} />
                  <span>Direct Reply</span>
                </button>

                {/* Open in external Email Client (mailto) as fallback */}
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Regarding ${selected.service || "FIDA Global"}`)}`}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs cursor-pointer shadow-xs"
                  title="Open default email application"
                >
                  <ExternalLink size={15} />
                  <span>Open in Mail App</span>
                </a>

                {/* Copy email address */}
                <button
                  type="button"
                  onClick={() => handleCopyEmail(selected.email)}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs cursor-pointer shadow-xs"
                >
                  {copiedEmail ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-white rounded-3xl border border-slate-200/90 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0047e1] flex items-center justify-center">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#052c65]">Select a customer lead</h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Choose a customer lead from the list on the left to read the full message and send a direct reply.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Direct Reply Modal ── */}
      <AnimatePresence>
        {replyModalOpen && selected && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !sendingReply && setReplyModalOpen(false)}
              className="fixed inset-0 bg-[#052c65]/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 z-10 flex flex-col space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#052c65] flex items-center gap-2">
                    <Mail className="text-emerald-600" size={20} />
                    <span>Send Direct Reply</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    This email will be delivered directly to the customer via FIDA Global mail service.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !sendingReply && setReplyModalOpen(false)}
                  disabled={sendingReply}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendReply} className="space-y-4">
                {/* Recipient Details */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">To:</span>
                    <strong className="text-slate-800">{selected.name}</strong>
                    <span className="text-slate-500 font-mono">({selected.email})</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded uppercase">
                    {selected.service || "Customer Lead"}
                  </span>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    disabled={sendingReply}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Reply Message
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    disabled={sendingReply}
                    placeholder="Type your reply to the customer here..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all resize-y"
                  />
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReplyModalOpen(false)}
                    disabled={sendingReply}
                    className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {sendingReply ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Reply...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Email Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
