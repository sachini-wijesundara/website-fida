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
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      } else {
        setInquiries([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];
  const filtered = safeInquiries.filter(i => 
    (i?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (i?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (i?.message?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Customer Leads</h2>
          <p className="text-[var(--text-muted)] mt-1">Manage incoming messages and prospective leads.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
             <input 
               type="text" 
               placeholder="Search messages..." 
               className="w-full bg-[var(--bg-elevated)] border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--green)]/50 transition-smooth"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* List */}
        <div className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
           {loading ? (
             <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--green)]" size={32} />
             </div>
           ) : filtered.length === 0 ? (
             <div className="glass p-12 rounded-3xl text-center">
                <p className="text-[var(--text-muted)] text-sm italic font-medium tracking-tight">No inquiries found matching your criteria.</p>
             </div>
           ) : (
             filtered.map((item) => (
               <motion.div
                 layoutId={item.id.toString()}
                 key={item.id}
                 onClick={() => setSelected(item)}
                 className={`glass p-6 rounded-3xl border transition-all cursor-pointer group ${
                   selected?.id === item.id ? 'border-[var(--green)] scale-[1.02] bg-white/[0.03]' : 'border-white/5 hover:border-white/20'
                 }`}
               >
                 <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                       <User size={18} className={selected?.id === item.id ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                       </div>
                       <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{item.service || "General Inquiry"}</p>
                       <p className="text-xs text-[var(--text-secondary)] mt-3 line-clamp-2 leading-relaxed opacity-70">
                          {item.message}
                       </p>
                    </div>
                 </div>
               </motion.div>
             ))
           )}
        </div>

        {/* View */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-[2.5rem] border border-white/5 p-10 h-full relative flex flex-col overflow-hidden"
              >
                <div className="flex items-start justify-between mb-8 border-b border-white/5 pb-8">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{selected.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                             <Mail size={14} className="text-[var(--green)]" />
                             <span className="text-xs font-medium text-white">{selected.email}</span>
                          </div>
                          {selected.company && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                               <Building size={14} className="text-[var(--blue)]" />
                               <span className="text-xs font-medium text-white">{selected.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 uppercase tracking-widest text-[10px] font-bold">
                             {selected.service}
                          </div>
                      </div>
                   </div>
                   <button className="p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-smooth">
                      <Trash2 size={20} />
                   </button>
                </div>
{/* Product Specific Info */}
                {selected.service === "Smart HRIS" && (
                  <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-[var(--green)]/5 rounded-3xl border border-[var(--green)]/10">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green)] mb-1">Employees</p>
                      <p className="text-xl font-black text-white">{selected.employee_count || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green)] mb-1">Hierarchy</p>
                      <p className="text-xl font-black text-white">{selected.division_status || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green)] mb-1">Companies</p>
                      <p className="text-xl font-black text-white">{selected.company_count || 'N/A'}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                   <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Received {new Date(selected.created_at).toLocaleString()}</span>
                   </div>
                   <div className="bg-white/[0.03] rounded-3xl p-8 border border-white/5 relative">
                      <MessageSquare className="absolute -top-3 -left-3 text-white/5" size={60} />
                      <p className="text-lg text-[var(--text-primary)] leading-relaxed relative z-10 whitespace-pre-wrap">
                        {selected.message}
                      </p>
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                   <a 
                     href={`mailto:${selected.email}`}
                     className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-black bg-[var(--green)] hover:scale-[1.02] transition-smooth active:scale-95 shadow-lg shadow-[var(--green-glow)]"
                   >
                     <Mail size={18} /> Direct Reply
                   </a>
                   <button className="px-8 py-4 rounded-2xl font-bold text-white glass hover:bg-white/10 transition-smooth">
                      Mark as Resolved
                   </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full glass rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center p-20 space-y-6">
                 <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-[var(--text-muted)] animate-pulse">
                    <MessageSquare size={40} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Select a message</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xs">Choose an inquiry from the list to view its contents and take action.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
