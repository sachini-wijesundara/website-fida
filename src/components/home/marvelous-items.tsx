"use client";

import React from "react";
import { motion } from "framer-motion";
import RobotArmHero from "@/components/animations/robot-arm";
import { Sparkles, Zap, Cpu, ShieldCheck } from "lucide-react";

const FeatureItem = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex gap-4 p-6 rounded-3xl public-card hover:-translate-y-1 transition-smooth group"
  >
    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-smooth shrink-0 h-fit">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default function MarvelousItems() {
  return (
    <section className="py-24 relative overflow-hidden public-themed-section">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px]     rounded-full -mr-64 -mt-32" style={{ background: "radial-gradient(circle, var(--tw-gradient-stops, rgba(56, 189, 248, 0.15)), transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px]     rounded-full -ml-64 -mb-32" style={{ background: "radial-gradient(circle, var(--tw-gradient-stops, rgba(56, 189, 248, 0.15)), transparent 70%)" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
                <Sparkles size={16} />
                <span>Premium Engineering</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight">
                Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Marvelous Items</span> for the Digital Age
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                Our precision-engineered solutions blend mechanical excellence with cutting-edge software to create products that push the boundaries of what's possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureItem 
                icon={Zap} 
                title="Ultra Fast" 
                desc="Optimized for maximum speed and sub-millisecond response times." 
              />
              <FeatureItem 
                icon={Cpu} 
                title="Smart Logic" 
                desc="Powered by adaptive AI that evolves with your business needs." 
              />
              <FeatureItem 
                icon={ShieldCheck} 
                title="Secure Core" 
                desc="Bank-grade encryption protecting every mechanical articulation." 
              />
              <FeatureItem 
                icon={Sparkles} 
                title="Elite Finish" 
                desc="Pixel-perfect attention to detail in every component we ship." 
              />
            </div>
          </div>

          {/* Right Side: The Robot Arm Animation */}
          <div className="lg:w-1/2 relative h-[600px] w-full flex items-center justify-center overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full h-full relative"
            >
              <RobotArmHero />
            </motion.div>

            {/* Floating Labels around the Arm */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] right-0 glass px-5 py-2.5 rounded-2xl border border-[#052c65]/10 text-[10px] uppercase tracking-widest font-bold text-[#167fa8] shadow-xl z-20"
            >
              Precise Control
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] left-[-5%] glass px-5 py-2.5 rounded-2xl border border-[#052c65]/10 text-[10px] uppercase tracking-widest font-bold text-[#159bb4] shadow-xl z-20"
            >
              Dynamic Torque
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
