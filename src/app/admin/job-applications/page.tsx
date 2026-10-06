"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, Mail, ExternalLink, Loader2, Download, Briefcase, Phone, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JobApplicationsAdmin() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await fetch("/api/job-applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error("Failed to fetch job applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/job-applications?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications(prev => (Array.isArray(prev) ? prev.filter(app => app.ApplicationId !== id) : []));
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || data?.error || "Failed to delete application");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.message || "An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/job-applications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => (Array.isArray(prev) ? prev.map(app => app.ApplicationId === id ? { ...app, Status: newStatus } : app) : []));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating the status");
    }
  };

  const safeApplications = Array.isArray(applications) ? applications : [];
  const filteredApplications = safeApplications.filter(app => 
    app.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.Position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
          <p className="text-[var(--text-secondary)] mt-1">Review candidate applications for open positions.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--green)] transition-smooth" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates by name, email or position..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[var(--bg-elevated)]/50 border-b border-[var(--grey-dark)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Applicant Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Position Applied</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Message / Cover Letter</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--grey-dark)]">
              <AnimatePresence mode="popLayout">
                {filteredApplications.map((app) => (
                  <motion.tr 
                    key={app.ApplicationId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-[var(--bg-elevated)]/30 transition-smooth"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] border border-[var(--grey-dark)] text-[var(--green)] flex items-center justify-center overflow-hidden shrink-0 mt-1">
                          <span className="font-bold text-lg">{app.FullName?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-[var(--green)] transition-smooth">{app.FullName}</p>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1">
                             <Mail size={10} /> <a href={`mailto:${app.Email}`} className="hover:text-[var(--blue)]">{app.Email}</a>
                          </div>
                          {app.Phone && app.Phone.trim() !== '' && (
                            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1">
                               <Phone size={10} /> <span>{app.Phone}</span>
                            </div>
                          )}
                          <p className="text-[10px] text-[var(--text-secondary)] mt-2 font-mono uppercase">
                             Applied: {new Date(app.AppliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                           <Briefcase size={16} className="text-[var(--text-secondary)]" />
                           <p className="font-medium text-sm text-[var(--text-primary)]">{app.Position}</p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-3 w-64 leading-relaxed" title={app.Message}>
                         {app.Message || "No message provided."}
                      </p>
                    </td>
                     <td className="px-6 py-5">
                        <select
                          value={app.Status}
                          onChange={(e) => handleUpdateStatus(app.ApplicationId, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-2 rounded-md border border-[var(--grey-dark)] outline-none cursor-pointer hover:opacity-80 transition-smooth
                            ${app.Status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                              app.Status === 'Reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                              app.Status === 'Interviewed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                              app.Status === 'Hired' ? 'bg-[var(--green-glow)] text-[var(--green)] border-[var(--green-dark)]' : 
                              'bg-red-500/10 text-red-400 border-red-500/20'}`}
                        >
                           <option value="Pending" className="bg-[#111]">Pending</option>
                           <option value="Reviewed" className="bg-[#111]">Reviewed</option>
                           <option value="Interviewed" className="bg-[#111]">Interviewed</option>
                           <option value="Hired" className="bg-[#111]">Hired</option>
                           <option value="Rejected" className="bg-[#111]">Rejected</option>
                        </select>
                    </td>
                    <td className="px-6 py-5 text-right align-top mt-1">
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {app.ResumeUrl && app.ResumeUrl.trim() !== '' ? (
                          <a 
                            href={app.ResumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open CV / Resume"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-smooth border border-blue-500/20 text-xs font-semibold"
                          >
                            <FileText size={14} />
                            <span>View CV</span>
                            <ExternalLink size={12} className="opacity-60" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-[var(--text-muted)] italic px-2">No CV</span>
                        )}
                        <button 
                          disabled={deletingId === app.ApplicationId}
                          onClick={() => handleDelete(app.ApplicationId)}
                          title="Delete Application"
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-smooth border border-red-500/20 disabled:opacity-50"
                        >
                          {deletingId === app.ApplicationId ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredApplications.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4 border border-[var(--grey-dark)] text-[var(--text-muted)]">
                 <Briefcase size={24} />
              </div>
              <p className="text-[var(--text-primary)] font-bold">No Applications Yet</p>
              <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto mt-2">When candidates apply for open positions, their applications will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
