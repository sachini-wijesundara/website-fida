"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  Edit2,
  Loader2,
  X,
  Eye,
  EyeOff,
  UserX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete state
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewUsername("");
        setNewPassword("");
        const refetch = await fetch("/api/admin/users");
        if (refetch.ok) setUsers(await refetch.json());
      } else {
        alert(data.message || "Failed to create user");
      }
    } catch (err) {
      alert("An error occurred while creating the user.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete the user "${username}"? This cannot be undone.`)) return;
    
    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      alert("An error occurred while deleting the user.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser({ ...user, password: "" });
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editingUser.username.trim(),
          status: editingUser.status || "Active",
          ...(editingUser.password ? { password: editingUser.password } : {})
        })
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        // Refetch users
        const refetch = await fetch("/api/admin/users");
        if (refetch.ok) setUsers(await refetch.json());
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update user");
      }
    } catch (err) {
      alert("An error occurred while updating the user.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Failed to update user status");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred while updating user status.");
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const activeCount = safeUsers.filter(u => (u?.status || 'Active').toLowerCase() === 'active').length;
  const inactiveCount = safeUsers.filter(u => u?.status?.toLowerCase() === 'inactive').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Users</h2>
          <p className="text-[var(--text-muted)] mt-1">Manage administrative access and team permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0047e1] hover:bg-[#0037b0] text-white font-bold shadow-[0_10px_25px_rgba(0,71,225,0.25)] hover:scale-[1.02] transition-smooth active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          <span>Create User</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: users.length.toString(), icon: Users, color: "var(--blue)" },
          { label: "Active Now", value: activeCount.toString(), icon: ShieldCheck, color: "var(--green)" },
          { label: "Inactive Users", value: inactiveCount.toString(), icon: UserX, color: "#ef4444" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5" style={{ color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.01]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              className="w-full bg-[var(--bg-elevated)] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--green)]/50 transition-smooth"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
            {activeCount} Active Staff Members
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-xs font-bold tracking-[0.2em] uppercase">Fetching Personnel Access...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">User</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safeUsers.filter(u => u?.username?.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-smooth">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--grey-dark)] to-[var(--bg-surface)] flex items-center justify-center font-bold text-white border border-white/10 uppercase">
                          {user.username[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user.username}</p>
                          <p className="text-[var(--text-muted)] text-xs mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-[var(--green)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={user.status || 'Active'}
                        onChange={(e) => handleToggleStatus(user.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all ${
                          (user.status || 'Active') === 'Active'
                            ? 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20 hover:bg-[var(--green)]/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        <option value="Active" className="bg-white text-slate-900">Active</option>
                        <option value="Inactive" className="bg-white text-slate-900">Inactive</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          title={`Edit ${user.username}`}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-smooth border border-blue-500/20 shadow-sm"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={isDeletingId === user.id}
                          title={`Delete ${user.username}`}
                          className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-smooth border border-red-500/20 shadow-sm disabled:opacity-50"
                        >
                          {isDeletingId === user.id ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </div>      {/* Create User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="admin-modal-overlay absolute inset-0 bg-[#052c65]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="admin-modal relative w-full max-w-md border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#052c65]">Create New User</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Add a new administrator to the system.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#052c65] flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Username</label>
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors" 
                    placeholder="e.g. jdoe_admin"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showCreatePassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-colors" 
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 p-1.5 text-slate-400 hover:text-[#052c65] transition-colors focus:outline-none"
                      title={showCreatePassword ? "Hide password" : "Show password"}
                      aria-label={showCreatePassword ? "Hide password" : "Show password"}
                    >
                      {showCreatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#052c65] font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isCreating}
                    className="flex-1 py-3 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm shadow-md"
                  >
                    {isCreating ? <Loader2 className="animate-spin" size={18} /> : "Create User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="admin-modal-overlay absolute inset-0 bg-[#052c65]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="admin-modal relative w-full max-w-md border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#052c65]">Edit User</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Modify details for <span className="text-[#0047e1] font-bold">{editingUser.username}</span></p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#052c65] flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Username</label>
                  <input 
                    type="text" 
                    value={editingUser.username || ""}
                    onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors" 
                    placeholder="e.g. jdoe_admin"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">New Password (Optional)</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showEditPassword ? "text" : "password"} 
                      value={editingUser.password}
                      onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                      className="w-full rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-colors" 
                      placeholder="Leave blank to keep current"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 p-1.5 text-slate-400 hover:text-[#052c65] transition-colors focus:outline-none"
                      title={showEditPassword ? "Hide password" : "Show password"}
                      aria-label={showEditPassword ? "Hide password" : "Show password"}
                    >
                      {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Account Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, status: "Active" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                        (editingUser.status || "Active") === "Active"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 shadow-sm"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200/70"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, status: "Inactive" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                        editingUser.status === "Inactive"
                          ? "bg-red-500/15 text-red-600 border-red-500/30 shadow-sm"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200/70"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Inactive
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#052c65] font-bold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex-1 py-3 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm shadow-md"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
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
