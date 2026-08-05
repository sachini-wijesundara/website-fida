"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "framer-motion";
import { X, Send, Loader2, RotateCcw, ChevronDown, Sparkles, Bot } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, RoundedBox, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK || "https://fidan8n.smarthris.live/webhook/378b9872-188c-4124-92f5-7f4ef3fe4359";

type Message = { id: number; role: "user" | "bot"; text: string; time: string; };

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "👋 Hello! I'm FIDA AI — your highly intelligent assistant. Tell me about your business needs or ask anything about Smart HRIS!",
  time: getTime(),
};

/* ─── Real 3D Robot Material & Component ───────────────── */
function Real3DRobot({ open, hover }: { open: boolean; hover: boolean }) {
  const eyeColor = open ? "#ef4444" : "#a855f7"; // Red when open/working, Purple otherwise
  const headRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (headRef.current) {
      // Look around subtly
      if (hover && !open) {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.3;
        headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.05;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group scale={1.8} position={[0, -0.6, 0]}>
      <Float speed={hover && !open ? 5 : 2} rotationIntensity={0.4} floatIntensity={1.5}>
        {/* Head assembly */}
        <group ref={headRef} position={[0, 0.4, 0]}>
          {/* Main Head */}
          <RoundedBox args={[1.2, 0.9, 1]} radius={0.15} smoothness={4}>
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.5} />
          </RoundedBox>
          
          {/* Visor Area */}
          <RoundedBox args={[1.0, 0.45, 1.05]} radius={0.1} smoothness={4} position={[0, 0.05, 0.02]}>
            <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.9} />
          </RoundedBox>
          
          {/* Eyes */}
          <Sphere args={[0.07, 16, 16]} position={[-0.25, 0.05, 0.55]}>
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
          </Sphere>
          <Sphere args={[0.07, 16, 16]} position={[0.25, 0.05, 0.55]}>
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} />
          </Sphere>
          
          {/* Antenna stem */}
          <Cylinder args={[0.02, 0.02, 0.4]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#e5e7eb" />
          </Cylinder>
          {/* Antenna Bulb */}
          <Sphere args={[0.08, 16, 16]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
          </Sphere>
          
          {/* Side Ears */}
          <Cylinder args={[0.15, 0.15, 1.3]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.5} metalness={0.3} />
          </Cylinder>
        </group>
        
        {/* Neck */}
        <Cylinder args={[0.12, 0.12, 0.3]} position={[0, -0.1, 0]}>
           <meshStandardMaterial color="#9ca3af" metalness={0.8} />
        </Cylinder>
        
        {/* Upper Body */}
        <RoundedBox args={[1.3, 0.8, 0.9]} radius={0.2} smoothness={4} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.4} />
        </RoundedBox>
        
        {/* Chest Display/Core */}
        <RoundedBox args={[0.7, 0.35, 0.95]} radius={0.05} smoothness={4} position={[0, -0.55, 0]}>
          <meshStandardMaterial color="#f3e8ff" emissive="#a855f7" emissiveIntensity={0.3} />
        </RoundedBox>

        {/* Orbiting Ring around body */}
        <mesh ref={ringRef} position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 16, 100]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
}

function RobotScene({ open, hover }: { open: boolean; hover: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full pointer-events-none">
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 0, 5]} intensity={1} color="#a855f7" />
      <Environment preset="city" />
      <Real3DRobot open={open} hover={hover} />
    </Canvas>
  );
}

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
          
        // Prevent default n8n immediate response from showing up as the final answer
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
            className="fixed bottom-32 right-5 z-[998] w-[400px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-[2.5rem] overflow-hidden"
            style={{
              height: "560px",
              background: "#ffffff",
              border: "1px solid #e9d5ff",
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-purple-100 bg-white">
              <div className="relative w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center overflow-hidden border border-purple-100">
                {/* 3D Robot Miniature */}
                <div className="absolute inset-0 scale-[1.5] translate-y-2">
                  <RobotScene open={false} hover={true} />
                </div>
                <motion.span
                  className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-gray-900 tracking-tight">FIDA AI</p>
                  <div className="px-2 py-0.5 rounded-full bg-purple-100 border border-purple-200">
                    <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">Powered by Smart HRIS Intelligence</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setMessages([GREETING]); idRef.current = 1; }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                  title="New chat"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" && (
                     <div className="relative w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                       <div className="absolute inset-0 scale-[1.5] translate-y-1.5 translate-x-0.5">
                         <RobotScene open={false} hover={false} />
                       </div>
                     </div>
                  )}
                  <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className="px-4 py-3 text-sm leading-relaxed"
                      style={{
                        background: msg.role === "user" ? "linear-gradient(135deg, #a855f7, #7e22ce)" : "#f3e8ff",
                        borderRadius: msg.role === "user" ? "1.25rem 1.25rem 0.3rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.3rem",
                        color: msg.role === "user" ? "white" : "#3b0764",
                        boxShadow: msg.role === "user" ? "0 4px 15px rgba(168, 85, 247, 0.3)" : "none",
                        fontWeight: 500,
                      }}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2.5">
                  <div className="relative w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                     <div className="absolute inset-0 scale-[1.5] translate-y-1.5 translate-x-0.5">
                       <RobotScene open={true} hover={false} />
                     </div>
                  </div>
                  <div className="px-4 py-3 rounded-[1.25rem] rounded-bl-[0.3rem] bg-purple-50 border border-purple-100 flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.span key={i} className="w-2 h-2 rounded-full bg-purple-500 block"
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
            <div className="px-5 pb-3 flex gap-2 flex-wrap flex-shrink-0 border-t border-purple-50 pt-3">
              {["Smart HRIS", "IT Solutions", "Get a Quote"].map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-purple-200 text-purple-700 bg-white hover:bg-purple-50 transition-all disabled:opacity-50"
                >
                  <Sparkles size={10} className="text-purple-500" />
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 pb-5 flex-shrink-0">
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-2 bg-gray-50 border border-gray-200 transition-all focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-200/50"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none py-2"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50"
                  style={{
                    background: input.trim() && !loading ? "linear-gradient(135deg, #a855f7, #7e22ce)" : "#e5e7eb",
                    boxShadow: input.trim() && !loading ? "0 4px 12px rgba(168, 85, 247, 0.4)" : "none",
                  }}
                >
                  <Send size={15} className={input.trim() && !loading ? "text-white" : "text-gray-400"} />
                </motion.button>
              </div>
              <p className="text-center text-[9px] text-gray-400 mt-2 tracking-widest uppercase font-bold">FIDA AI · Powered by n8n</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Robot Launcher ─────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[999] flex items-center justify-center">
        {/* Idle Pop-Up Cloud */}
        <AnimatePresence>
          {!open && showIdleCloud && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute right-[85px] bottom-[15px] pointer-events-none"
            >
              <div
                className="relative px-5 py-3.5 rounded-3xl rounded-br-sm text-[11px] font-black text-purple-900 bg-white border border-purple-100 shadow-[0_12px_35px_rgba(168,85,247,0.2)] w-[160px] leading-relaxed"
              >
                I am here! 👋<br/>Do you want to know anything?
                
                {/* Speech tail pointing to robot */}
                <div className="absolute right-[-8px] bottom-[4px] w-0 h-0 border-t-[8px] border-l-[10px] border-b-[4px] border-t-transparent border-b-transparent border-l-white drop-shadow-md" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The floating robot button */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          style={{ y: open ? 0 : bobY }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-20 h-20 flex items-center justify-center focus:outline-none"
          aria-label="Open FIDA AI chat"
        >
          {/* Main button bg layer for glow (only visible when open as 'X' button) */}
          <div
            className="absolute inset-0 rounded-[2rem] transition-all duration-300"
            style={{
              background: open ? "#f1f5f9" : "transparent",
              border: open ? "1px solid #e2e8f0" : "none",
              boxShadow: open 
                ? "0 10px 25px rgba(0,0,0,0.1)" 
                : "none",
              backdropFilter: "none",
            }}
          />

          {/* 3D Robot / Close Icon Swap */}
          <div className={`relative w-full h-full flex items-center justify-center ${open ? 'overflow-hidden rounded-[2rem]' : 'overflow-visible'} z-10`}>
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="x"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                >
                  <X size={26} className="text-gray-500" />
                </motion.div>
              ) : (
                <motion.div key="robot"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className="w-[125%] h-[125%]"
                >
                  <RobotScene open={false} hover={hover} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification badge */}
          {!open && (
            <motion.div
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-purple-500 border-[1.5px] border-white flex items-center justify-center z-20 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
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
