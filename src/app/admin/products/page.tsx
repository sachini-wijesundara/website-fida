"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, Loader2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product/solution?")) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Solutions</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage the high-level platforms (HRIS, ERP, etc.) on the Solutions page.</p>
        </div>
        <Link 
          href="/admin/solutions/create"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)]"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--green)] transition-smooth" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-elevated)]/50 border-b border-[var(--grey-dark)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Tag</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--grey-dark)]">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <motion.tr 
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-[var(--bg-elevated)]/30 transition-smooth"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--grey-dark)] text-[var(--green)]">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm group-hover:text-[var(--green)] transition-smooth text-white">{p.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md" style={{ background: `${p.tag_color}20`, color: p.tag_color }}>
                        {p.tag}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/solutions/edit/${p.id}`} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--green)]">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-white">
              <p className="text-[var(--text-muted)]">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
