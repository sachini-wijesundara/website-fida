"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Loader2, 
  Eye, 
  ArrowUpDown, 
  FileText,
  Save,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-[var(--bg-elevated)]/50 rounded-2xl border border-[var(--grey-dark)] text-sm text-[var(--text-muted)]">
      Loading Editor...
    </div>
  ),
});

interface TermItem {
  id: number;
  title: string;
  slug?: string;
  content: string;
  status: "Published" | "Draft";
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export default function AdminTermsPage() {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TermItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Draft");
  const [formOrder, setFormOrder] = useState<number>(1);

  // Toast / notification
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/terms?all=true");
      if (!res.ok) throw new Error("Failed to fetch terms");
      const data = await res.json();
      setTerms(data);
    } catch (err: any) {
      console.error(err);
      showNotification("Failed to load terms: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormContent("");
    setFormStatus("Published");
    const nextOrder = terms.length > 0 ? Math.max(...terms.map((t) => t.order_index || 0)) + 1 : 1;
    setFormOrder(nextOrder);
    setIsModalOpen(true);
  };

  const openEditModal = (term: TermItem) => {
    setEditingItem(term);
    setFormTitle(term.title);
    setFormContent(term.content);
    setFormStatus(term.status);
    setFormOrder(term.order_index || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showNotification("Please provide a section title", "error");
      return;
    }
    if (!formContent.trim() || formContent === "<p><br></p>") {
      showNotification("Please enter content for this section", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: editingItem?.id,
        title: formTitle,
        content: formContent,
        status: formStatus,
        order_index: formOrder,
      };

      const res = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save term");
      }

      setIsModalOpen(false);
      showNotification(editingItem ? "Terms section updated successfully!" : "New terms section created successfully!");
      fetchTerms();
    } catch (err: any) {
      console.error(err);
      showNotification(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (term: TermItem) => {
    const nextStatus = term.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/terms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: term.id, status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTerms((prev) =>
        prev.map((t) => (t.id === term.id ? { ...t, status: nextStatus } : t))
      );
      showNotification(`"${term.title}" marked as ${nextStatus}!`);
    } catch (err: any) {
      console.error(err);
      showNotification("Failed to toggle status: " + err.message, "error");
    }
  };

  const handleDelete = async (term: TermItem) => {
    if (!confirm(`Are you sure you want to delete "${term.title}"?`)) return;

    try {
      const res = await fetch(`/api/terms?id=${term.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete term");

      setTerms((prev) => prev.filter((t) => t.id !== term.id));
      showNotification("Terms section deleted successfully!");
    } catch (err: any) {
      console.error(err);
      showNotification("Failed to delete: " + err.message, "error");
    }
  };

  // Filtered terms
  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Quill Editor Toolbar Modules
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
      [{ color: [] }, { background: [] }],
    ],
  };

  const publishedCount = terms.filter((t) => t.status === "Published").length;
  const draftCount = terms.filter((t) => t.status === "Draft").length;

  return (
    <div className="space-y-8 pb-20 admin-terms-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border ${
              notification.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30 backdrop-blur-md"
                : "bg-red-950/90 text-red-200 border-red-500/30 backdrop-blur-md"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-[var(--grey-dark)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#004dfc]/10 border border-[#004dfc]/20 flex items-center justify-center text-[#004dfc]">
              <Scale size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Terms & Conditions
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                Manage clauses, draft changes, rich text formatting, and public publishing status.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Eye size={18} />
            <span>View Public Page</span>
          </a>
          <button
            onClick={openAddModal}
            style={{ backgroundColor: "#004dfc", color: "#ffffff" }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-smooth shadow-lg shadow-blue-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>Add Section</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass p-6 rounded-3xl border border-[var(--grey-dark)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Clauses</p>
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mt-1">{terms.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#004dfc] flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-[var(--grey-dark)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Published</p>
            <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">{publishedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-[var(--grey-dark)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Drafts</p>
            <h3 className="text-2xl font-extrabold text-amber-500 mt-1">{draftCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Search & Status Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-[#004dfc] focus:outline-none transition-smooth"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Published", "Draft"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-smooth ${
                statusFilter === st
                  ? "bg-[#004dfc] text-white shadow-md shadow-blue-500/20"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--grey-dark)]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
          <Loader2 className="animate-spin text-[#004dfc]" size={36} />
          <p className="text-sm font-medium">Loading terms and conditions...</p>
        </div>
      ) : filteredTerms.length === 0 ? (
        <div className="glass rounded-3xl border border-[var(--grey-dark)] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 text-[#004dfc] mx-auto flex items-center justify-center">
            <Scale size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No terms found</h3>
          <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
            {searchTerm || statusFilter !== "All"
              ? "No sections match your search or filter criteria."
              : "Get started by adding your first Terms & Conditions clause."}
          </p>
          <button
            onClick={openAddModal}
            style={{ backgroundColor: "#004dfc", color: "#ffffff" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:opacity-95"
          >
            <Plus size={16} />
            <span>Add First Section</span>
          </button>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--grey-dark)] bg-[var(--bg-elevated)]/50 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="py-4 px-6 w-20 text-center">Order</th>
                  <th className="py-4 px-6">Clause Title</th>
                  <th className="py-4 px-6">Content Preview</th>
                  <th className="py-4 px-6 w-36 text-center">Status</th>
                  <th className="py-4 px-6 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--grey-dark)] text-sm">
                {filteredTerms.map((term) => (
                  <tr
                    key={term.id}
                    className="hover:bg-[var(--bg-elevated)]/40 transition-colors group"
                  >
                    <td className="py-4 px-6 text-center font-bold text-[var(--text-muted)]">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-elevated)] text-xs border border-[var(--grey-dark)]">
                        #{term.order_index}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[var(--text-primary)]">
                      <div className="flex items-center gap-3">
                        <Scale size={16} className="text-[#004dfc] shrink-0" />
                        <span className="line-clamp-1">{term.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] text-xs max-w-md">
                      <div
                        className="line-clamp-2 prose-sm text-[var(--text-muted)]"
                        dangerouslySetInnerHTML={{
                          __html: term.content.replace(/<[^>]+>/g, " ").slice(0, 150) + "...",
                        }}
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(term)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-smooth border ${
                          term.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            term.status === "Published" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                          }`}
                        />
                        {term.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(term)}
                          className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#004dfc]/20 hover:text-[#004dfc] border border-[var(--grey-dark)] text-[var(--text-secondary)] transition-smooth"
                          title="Edit clause"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(term)}
                          className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-red-500/20 hover:text-red-400 border border-[var(--grey-dark)] text-[var(--text-secondary)] transition-smooth"
                          title="Delete clause"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal with Rich Text Quill Editor */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="admin-modal relative w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-[2rem] p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--grey-dark)] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#004dfc]/10 text-[#004dfc] flex items-center justify-center">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {editingItem ? "Edit Terms Clause" : "Add New Terms Clause"}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Format your legal terms with bold, underline, lists, and headings.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-smooth"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-6">
                {/* Title and Order */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Clause Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1. Acceptance of Terms"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm focus:border-[#004dfc] focus:outline-none transition-smooth"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formOrder}
                      onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-xl px-4 py-3 text-sm focus:border-[#004dfc] focus:outline-none transition-smooth"
                    />
                  </div>
                </div>

                {/* Status Toggle (Draft / Published) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setFormStatus("Published")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-smooth border ${
                        formStatus === "Published"
                          ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                          : "bg-[var(--bg-elevated)] border-[var(--grey-dark)] text-[var(--text-secondary)] hover:border-emerald-500/30"
                      }`}
                    >
                      <CheckCircle size={14} />
                      <span>Published (Live)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus("Draft")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-smooth border ${
                        formStatus === "Draft"
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-sm"
                          : "bg-[var(--bg-elevated)] border-[var(--grey-dark)] text-[var(--text-secondary)] hover:border-amber-500/30"
                      }`}
                    >
                      <Clock size={14} />
                      <span>Draft (Hidden)</span>
                    </button>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Clause Content <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Supports <strong>Bold</strong>, <u>Underline</u>, <em>Italics</em> & Lists
                    </span>
                  </div>

                  <div className="bg-[var(--bg-elevated)]/30 rounded-2xl overflow-hidden border border-[var(--grey-dark)] quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={formContent}
                      onChange={setFormContent}
                      modules={quillModules}
                      className="bg-transparent min-h-[260px]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--grey-dark)]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl border border-[var(--grey-dark)] text-sm font-bold hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ backgroundColor: "#004dfc", color: "#ffffff" }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-smooth disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving Clause...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingItem ? "Update Clause" : "Publish Clause"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Styles for Quill */}
      <style jsx global>{`
        .quill-wrapper .ql-toolbar {
          border: none !important;
          background: var(--bg-elevated) !important;
          border-bottom: 1px solid var(--grey-dark) !important;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .quill-wrapper .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-primary);
          height: 240px;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: var(--text-muted) !important;
          font-style: normal;
        }
        .quill-wrapper .ql-snow.ql-toolbar button {
          color: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active {
          color: #004dfc !important;
        }
        .quill-wrapper .ql-snow.ql-toolbar .ql-stroke {
          stroke: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #004dfc !important;
        }
        .quill-wrapper .ql-snow.ql-toolbar .ql-fill {
          fill: var(--text-secondary);
        }
        .quill-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,
        .quill-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #004dfc !important;
        }
        .quill-wrapper .ql-snow .ql-picker {
          color: var(--text-secondary);
        }
        .quill-wrapper .ql-picker-label:hover {
          color: #004dfc !important;
        }
      `}</style>
    </div>
  );
}
