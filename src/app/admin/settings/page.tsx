"use client";

import React, { useState, useEffect } from "react";
import { Check, Settings, Save, Sparkles, Trees, Snowflake, Sun, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Add timestamp to bypass any stuck client-side cache in dev mode
        const res = await fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSeason = async (season: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({ key: "active_season", value: season }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setSettings({ ...settings, active_season: season });
        alert("Seasonal decoration updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating season");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading Global Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white">Global Settings</h2>
        <p className="text-[var(--text-secondary)] mt-1">Configure site-wide preferences and seasonal themes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seasonal Decoration Card */}
        <section className="glass rounded-[2.5rem] p-10 border border-white/10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Seasonal Decorations</h3>
              <p className="text-sm text-[var(--text-secondary)]">Choose an active theme for the home page hero section.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SeasonButton 
              active={!settings.active_season || settings.active_season === "None"} 
              onClick={() => updateSeason("None")} 
              icon={<XIcon />} 
              label="Standard (None)" 
              desc="Normal business theme"
            />
            <SeasonButton 
              active={settings.active_season === "NewYear"} 
              onClick={() => updateSeason("NewYear")} 
              icon={<Sun className="text-yellow-400" />} 
              label="Sri Lankan New Year" 
              desc="Fireworks & Celebration"
            />
            <SeasonButton 
              active={settings.active_season === "Christmas"} 
              onClick={() => updateSeason("Christmas")} 
              icon={<Snowflake className="text-blue-400" />} 
              label="Christmas" 
              desc="Falling Snow & Festive"
            />
            <SeasonButton 
              active={settings.active_season === "Vesak"} 
              onClick={() => updateSeason("Vesak")} 
              icon={<Trees className="text-orange-400" />} 
              label="Vesak Festival" 
              desc="Floating Lanterns & Glow"
            />
          </div>
        </section>

        {/* Site Stats Card */}
        <section className="glass rounded-[2.5rem] p-10 border border-white/10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Company Statistics</h3>
              <p className="text-sm text-[var(--text-secondary)]">Update the numbers displayed on the frontend.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Company Count (Clients)</label>
              <input 
                type="text" 
                value={settings.clients_count || ""} 
                onChange={(e) => setSettings({ ...settings, clients_count: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Experience (Years)</label>
              <input 
                type="text" 
                value={settings.experience_years || ""} 
                onChange={(e) => setSettings({ ...settings, experience_years: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g. 14"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Countries Count</label>
              <input 
                type="text" 
                value={settings.countries_count || ""} 
                onChange={(e) => setSettings({ ...settings, countries_count: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g. 12"
              />
            </div>
            <button
              onClick={async () => {
                setSaving(true);
                try {
                  await Promise.all([
                    fetch("/api/settings", { method: "POST", body: JSON.stringify({ key: "clients_count", value: settings.clients_count || "500" }), headers: { "Content-Type": "application/json" } }),
                    fetch("/api/settings", { method: "POST", body: JSON.stringify({ key: "experience_years", value: settings.experience_years || "14" }), headers: { "Content-Type": "application/json" } }),
                    fetch("/api/settings", { method: "POST", body: JSON.stringify({ key: "countries_count", value: settings.countries_count || "12" }), headers: { "Content-Type": "application/json" } })
                  ]);
                  alert("Statistics updated successfully!");
                } catch (err) {
                  alert("Error updating statistics");
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Statistics
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function SeasonButton({ active, onClick, icon, label, desc }: any) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative p-6 rounded-3xl border text-left transition-all ${
        active 
          ? "bg-blue-500/15 border-blue-500 ring-2 ring-blue-400/25 shadow-lg shadow-blue-500/15" 
          : "bg-white/5 border-white/5 hover:border-white/20"
      }`}
    >
      {active && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
          <Check size={12} strokeWidth={3} /> Active
        </span>
      )}
      <div className="mb-4">{icon}</div>
      <div className={`font-bold text-sm mb-1 ${active ? "text-blue-400" : "text-white"}`}>{label}</div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">{desc}</div>
    </button>
  );
}
