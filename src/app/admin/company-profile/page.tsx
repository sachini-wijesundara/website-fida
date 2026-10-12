"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  X, 
  Check, 
  Sparkles,
  Eye,
  FileCheck,
  RefreshCw,
  Clock,
  Layers,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompanyProfileItem {
  id: number;
  title: string;
  version: string;
  category: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: string;
  is_active: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminCompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfileItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formVersion, setFormVersion] = useState("2026 Edition");
  const [formCategory, setFormCategory] = useState("Corporate Overview");
  const [formDescription, setFormDescription] = useState("");
  const [formFileUrl, setFormFileUrl] = useState("/Company%20Profile%202026.pdf");
  const [formFileName, setFormFileName] = useState("Company Profile 2026.pdf");
  const [formFileSize, setFormFileSize] = useState("62.9 MB");

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/company-profile", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setProfile(data.data[0]);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching company profile:", err);
      showToast("Failed to load company profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openAddModal = () => {
    if (profile) {
      showToast("A company profile is already added. You can replace or update it.", "error");
      return;
    }
    setModalMode("add");
    setFormTitle("");
    setFormVersion("2026 Edition");
    setFormCategory("Corporate Overview");
    setFormDescription("");
    setFormFileUrl("/Company%20Profile%202026.pdf");
    setFormFileName("Company Profile 2026.pdf");
    setFormFileSize("62.9 MB");
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!profile) return;
    setModalMode("edit");
    setFormTitle(profile.title || "");
    setFormVersion(profile.version || "2026 Edition");
    setFormCategory(profile.category || "Corporate Overview");
    setFormDescription(profile.description || "");
    setFormFileUrl(profile.file_url || "");
    setFormFileName(profile.file_name || "Company Profile.pdf");
    setFormFileSize(profile.file_size || "");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(`Uploading ${file.name}...`);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/company-profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormFileUrl(data.file_url);
        setFormFileName(data.file_name);
        setFormFileSize(data.file_size);
        if (!formTitle) {
          setFormTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
        showToast("PDF file uploaded successfully!");
      } else {
        showToast(data.message || "File upload failed", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Network error uploading file", "error");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast("Please provide a title", "error");
      return;
    }

    if (!formFileUrl.trim()) {
      showToast("Please upload or provide a PDF file path", "error");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = modalMode === "edit";
      const endpoint = "/api/admin/company-profile";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        id: profile?.id,
        title: formTitle,
        version: formVersion,
        category: formCategory,
        description: formDescription,
        file_url: formFileUrl,
        file_name: formFileName,
        file_size: formFileSize,
        is_active: true,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        showToast(isEditing ? "Profile updated successfully!" : "Profile added successfully!");
        fetchProfile();
      } else {
        showToast(data.message || "Action failed", "error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to save company profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/company-profile?id=${profile.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsDeleteModalOpen(false);
        setProfile(null);
        showToast("Company profile deleted successfully. You can now add a new profile.");
      } else {
        showToast(data.message || "Failed to delete profile", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Network error deleting profile", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-8 right-8 z-[1000] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-bold bg-white ${
              toast.type === "success"
                ? "text-emerald-700 border-emerald-300 shadow-emerald-500/10"
                : "text-rose-700 border-rose-300 shadow-rose-500/10"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#052c65] tracking-tight">Manage Company Profile</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage the official FIDA Global corporate profile PDF document available across the website.
          </p>
        </div>

        {/* Header Action Button */}
        <div>
          {profile ? (
            <button
              type="button"
              onClick={openEditModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white bg-[#0047e1] hover:bg-[#0037b0] transition-all shadow-md shadow-[#0047e1]/20 cursor-pointer text-sm active:scale-[0.98]"
            >
              <RefreshCw size={15} />
              <span>Replace / Update Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white bg-[#0047e1] hover:bg-[#0037b0] transition-all shadow-md shadow-[#0047e1]/20 cursor-pointer text-sm active:scale-[0.98]"
            >
              <Plus size={17} />
              <span>Add Company Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="h-72 bg-white rounded-3xl border border-slate-200/90 flex flex-col items-center justify-center gap-3 text-[#0047e1]">
          <Loader2 className="animate-spin" size={36} />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Company Profile...</p>
        </div>
      ) : profile ? (
        /* ── Profile Present Card ── */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-9 relative flex flex-col space-y-6">
            {/* Top Status & Meta Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Public Document
                </span>

                {profile.version && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80">
                    {profile.version}
                  </span>
                )}

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#0047e1] text-xs font-semibold border border-blue-100">
                  {profile.category || "Corporate Overview"}
                </span>
              </div>

              {/* Single profile notice */}
              <span className="text-xs text-slate-400 font-medium">
                1 active profile registered (replace or delete to change)
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2.5">
              <h3 className="text-2xl font-black text-[#052c65] tracking-tight">{profile.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                {profile.description || "Official comprehensive company profile covering FIDA Global services, enterprise solutions, Smart HRIS ecosystem, and client milestones."}
              </p>
            </div>

            {/* Document File Capsule */}
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-[#0047e1] shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{profile.file_name || "Company Profile.pdf"}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded">PDF</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    {profile.file_size && <span>File size: <strong>{profile.file_size}</strong></span>}
                    {profile.updated_at && (
                      <span>&bull; Last updated: <strong>{new Date(profile.updated_at).toLocaleDateString()}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Preview & Download */}
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={profile.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
                >
                  <Eye size={15} className="text-[#0047e1]" />
                  <span>Preview</span>
                </a>

                <a
                  href={profile.file_url}
                  download={profile.file_name || "Company Profile.pdf"}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0047e1] border border-blue-200 text-xs font-bold transition-all shadow-xs"
                >
                  <Download size={15} />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openEditModal}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-white bg-[#0047e1] hover:bg-[#0037b0] active:scale-[0.99] transition-all shadow-md shadow-[#0047e1]/20 cursor-pointer text-sm"
                >
                  <Edit3 size={16} />
                  <span>Update / Replace Profile</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all text-xs cursor-pointer"
                title="Delete this company profile"
              >
                <Trash2 size={15} />
                <span>Delete Profile</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty State: Can Add New ── */
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0047e1] flex items-center justify-center">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#052c65]">No Company Profile Uploaded</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Upload the official FIDA Global company profile document to make it available for download from the website header and footer.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-[#0047e1] hover:bg-[#0037b0] transition-all shadow-md shadow-[#0047e1]/20 cursor-pointer text-sm active:scale-[0.98] mt-2"
          >
            <Plus size={17} />
            <span>Add Company Profile</span>
          </button>
        </div>
      )}

      {/* ── Add / Update Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setIsModalOpen(false)}
              className="fixed inset-0 bg-[#052c65]/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 z-10 flex flex-col space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#052c65] flex items-center gap-2">
                    <FileText className="text-[#0047e1]" size={20} />
                    <span>{modalMode === "edit" ? "Update / Replace Company Profile" : "Add Company Profile"}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {modalMode === "edit"
                      ? "Replace the document PDF or update company profile metadata."
                      : "Add the official FIDA Global corporate profile PDF."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !submitting && setIsModalOpen(false)}
                  disabled={submitting}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Profile Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FIDA Global Corporate Profile 2026"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Version & Category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Version / Edition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 Edition"
                      value={formVersion}
                      onChange={(e) => setFormVersion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="Corporate Overview">Corporate Overview</option>
                      <option value="Smart HRIS Ecosystem">Smart HRIS Ecosystem</option>
                      <option value="Solutions Catalog">Solutions Catalog</option>
                      <option value="Investor Deck">Investor Deck</option>
                      <option value="Service Brochure">Service Brochure</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {modalMode === "edit" ? "Upload Replacement PDF" : "Upload Document PDF"}
                  </label>
                  <div className="border-2 border-dashed border-blue-200 hover:border-[#0047e1] rounded-2xl p-5 text-center bg-blue-50/40 hover:bg-blue-50/70 transition-all">
                    <input
                      type="file"
                      accept=".pdf"
                      id="company-profile-file-input"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="company-profile-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2 py-1"
                    >
                      {uploading ? (
                        <Loader2 className="animate-spin text-[#0047e1]" size={28} />
                      ) : (
                        <Upload className="text-[#0047e1]" size={28} />
                      )}
                      <span className="text-xs font-bold text-slate-800">
                        {uploading ? uploadProgress : "Click to browse & upload PDF document"}
                      </span>
                      <span className="text-[11px] text-slate-500">Supports PDF format up to 100MB</span>
                    </label>
                  </div>
                </div>

                {/* Direct File Path / URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Attached File Path *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/Company%20Profile%202026.pdf"
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2 px-4 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-[#0047e1] transition-all"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>Name: <strong>{formFileName || "Company Profile.pdf"}</strong></span>
                    <span>Size: <strong>{formFileSize || "Auto"}</strong></span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Description & Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief overview of what is covered in this company profile release..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0047e1] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="px-6 py-2.5 rounded-2xl bg-[#0047e1] hover:bg-[#0037b0] text-xs font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-[#0047e1]/20 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>{modalMode === "edit" ? "Update Profile" : "Save Profile"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Confirm Delete Modal ── */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-[#052c65]/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 z-10 space-y-5 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#052c65]">Delete Company Profile?</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  This will remove the current active company profile document from the website. You will be able to add a new company profile document afterwards.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-md shadow-red-600/20"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
