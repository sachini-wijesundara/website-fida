"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

function BotAvatar({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-white flex items-center justify-center overflow-hidden border border-sky-100 shadow-sm p-0.5 ${className}`}>
      <img
        src="/fida-ai-agent.png"
        alt="FIDA AI Agent"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK || "https://fidan8n.smarthris.live/webhook/378b9872-188c-4124-92f5-7f4ef3fe4359";

type Message = { id: number; role: "user" | "bot"; text: string; time: string; };

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "👋 Hello! I'm FIDA AI — your intelligent enterprise assistant. Tell me about your business needs or ask anything about Smart HRIS!",
  time: "Just now",
};

/* ─── Main ChatBot Component ───────────────────────────── */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [showIdleCloud, setShowIdleCloud] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);
  const sessionIdRef = useRef(`fida_sess_${Math.random().toString(36).substring(2, 12)}`);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const bobY = useMotionValue(0);

  useAnimationFrame((t) => {
    bobY.set(Math.sin(t / 800) * 8);
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setShowIdleCloud(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    if (!open && !hover) {
      idleTimerRef.current = setTimeout(() => {
        setShowIdleCloud(true);
      }, 5000);
    }

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [open, hover]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: idRef.current++, role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionIdRef.current }),
      });

      let botText = "I'm having trouble connecting right now. Please try again or contact us at info@fidaglobal.com.";

      if (res.ok) {
        const data = await res.json();
        botText = data?.output || data?.text || data?.message || data?.response
          || (typeof data === "string" ? data : JSON.stringify(data));
          
        if (botText === "Workflow was started" || botText === "Workflow got started.") {
          botText = "⏳ Loading the answer...";
        }
      }

      setMessages((prev) => [...prev, { id: idRef.current++, role: "bot", text: botText, time: getTime() }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: idRef.current++, role: "bot",
        text: "Connection error. Please contact us at info@fidaglobal.com.",
        time: getTime(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  // Only exclude admin backoffice
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 280 }}
            className="fida-chatbot fixed bottom-[72px] sm:bottom-24 right-3 sm:right-6 z-[998] w-[370px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
            style={{
              height: "min(520px, calc(100dvh - 5.5rem))",
              maxHeight: "calc(100dvh - 5.5rem)",
              background: "#ffffff",
              border: "1px solid #bae6fd",
              boxShadow: "0 20px 45px -10px rgba(14, 165, 233, 0.25), 0 0 0 1px rgba(14, 165, 233, 0.1)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-sky-100 bg-white">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-sky-50 flex items-center justify-center overflow-hidden border border-sky-200/80 shadow-sm flex-shrink-0 p-0.5">
                <img
                  src="/fida-ai-agent.png"
                  alt="FIDA AI Agent"
                  className="w-full h-full object-contain"
                />
                <motion.span
                  className="absolute bottom-0.5 right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <p className="text-xs sm:text-sm font-black text-[#052c65] tracking-tight truncate">FIDA AI Agent</p>
                  <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-100 border border-sky-200 shrink-0">
                    <span className="text-[8px] sm:text-[9px] font-black text-sky-700 uppercase tracking-widest">Active</span>
                  </div>
                </div>
                <p className="text-[9px] sm:text-[10px] text-[#536b8a] font-medium mt-0.5 truncate">Your Enterprise Intelligence Assistant</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setMessages([GREETING]); idRef.current = 1; }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 hover:text-sky-600 hover:bg-sky-50 transition-all text-xs font-bold"
                  title="Reset conversation"
                  aria-label="Reset chat"
                >
                  ↺
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                  aria-label="Close chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-sky-50/30 to-white overscroll-contain">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`flex items-end gap-2 sm:gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" && (
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BotAvatar />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-sm leading-relaxed break-words"
                      style={{
                        background: msg.role === "user" ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "#e0f2fe",
                        borderRadius: msg.role === "user" ? "1.25rem 1.25rem 0.3rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.3rem",
                        color: msg.role === "user" ? "white" : "#0c4a6e",
                        boxShadow: msg.role === "user" ? "0 4px 15px rgba(14, 165, 233, 0.3)" : "none",
                        fontWeight: 500,
                      }}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] sm:text-[9px] text-gray-400 px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2 sm:gap-2.5">
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-sky-100 flex items-center justify-center flex-shrink-0 overflow-hidden p-0.5 shadow-sm">
                    <img src="/fida-ai-agent.png" alt="FIDA AI" className="w-full h-full object-contain animate-pulse" />
                  </div>
                  <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-[1.25rem] rounded-bl-[0.3rem] bg-sky-50 border border-sky-100 flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-500 block"
                        animate={{ y: [-4, 0, -4], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            <div className="px-3.5 pb-2 sm:px-5 sm:pb-3 flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-shrink-0 border-t border-sky-50 pt-2.5 sm:pt-3">
              {["Smart HRIS", "IT Solutions", "Get a Quote"].map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-sky-200 text-sky-700 bg-white hover:bg-sky-50 transition-all disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Sparkles size={9} className="text-sky-500 shrink-0" />
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 flex-shrink-0">
              <div
                className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 transition-all focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/50"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-[16px] sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none py-1.5 sm:py-2"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50"
                  style={{
                    background: input.trim() && !loading ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "#e5e7eb",
                    boxShadow: input.trim() && !loading ? "0 4px 12px rgba(14, 165, 233, 0.4)" : "none",
                  }}
                  aria-label="Send message"
                >
                  <Send size={14} className={input.trim() && !loading ? "text-white" : "text-gray-400"} />
                </motion.button>
              </div>
              <p className="text-center text-[8px] sm:text-[9px] text-gray-400 mt-1.5 sm:mt-2 tracking-widest uppercase font-bold">FIDA AI · Enterprise Assistant</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Bot Launcher ─────────────────────── */}
      <div className="fida-chatbot fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999] flex items-center justify-center">
        {/* Idle Pop-Up Cloud */}
        <AnimatePresence>
          {!open && showIdleCloud && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute right-[68px] sm:right-[76px] bottom-[8px] sm:bottom-[12px] pointer-events-none hidden sm:block z-30"
            >
              <div
                className="relative px-3.5 py-2.5 rounded-2xl rounded-br-none text-[11px] font-bold text-sky-950 bg-white border border-sky-100 shadow-[0_10px_30px_rgba(14,165,233,0.22)] w-[148px] leading-snug"
              >
                I am here! 👋<br/>
                <span className="text-[10px] font-medium text-sky-700">How can I help you today?</span>
                
                {/* Speech tail pointing to robot */}
                <div className="absolute right-[-7px] bottom-[8px] w-0 h-0 border-t-[6px] border-l-[8px] border-b-[4px] border-t-transparent border-b-transparent border-l-white drop-shadow-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The floating FIDA AI Agent button */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          style={{ y: open ? 0 : bobY }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center focus:outline-none group cursor-pointer"
          aria-label="Open FIDA AI chat"
        >
          {/* FIDA AI Agent Avatar / Close Icon Swap */}
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="x"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="fida-ai-agent"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className="w-full h-full flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(14,165,233,0.35)] transition-all"
                >
                  <img
                    src="/fida-ai-agent.png"
                    alt="FIDA AI Agent"
                    className="w-full h-full object-contain select-none pointer-events-none group-hover:scale-105 transition-transform"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification badge with Sparkles */}
          {!open && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center z-20 shadow-[0_0_10px_rgba(14,165,233,0.8)]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={10} className="text-white" />
            </motion.div>
          )}
        </motion.button>
      </div>
    </>
  );
}
