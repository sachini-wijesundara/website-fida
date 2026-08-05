"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

interface Customer {
  id: number;
  name: string;
  logo_url: string | null;
  status: string;
}

const TickerRow = ({
  items,
  speed = 20,
  direction = "left",
  fontClass,
}: {
  items: (string | Customer)[];
  speed?: number;
  direction?: "left" | "right";
  fontClass: string;
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="flex overflow-hidden py-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex gap-20 items-center whitespace-nowrap px-8"
        style={{
          animation: `ticker-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes ticker-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            @keyframes ticker-right {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
            }
        `}} />

        {[...items, ...items, ...items, ...items].map((item, i) => {
          const isCustomer = typeof item !== "string";
          const customer = isCustomer ? (item as Customer) : null;
          const name = customer ? customer.name : (item as string);

          return (
            <div key={i} className="flex items-center justify-center shrink-0 w-56 h-28 mx-8 group cursor-pointer transition-smooth">
              {customer && customer.logo_url ? (
                <img
                  src={customer.logo_url}
                  alt={name}
                  className="max-w-[180px] max-h-[90px] object-contain transition-all duration-500 pointer-events-none group-hover:scale-125 group-hover:drop-shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                />
              ) : (
                <span
                  className={`${fontClass} text-3xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-300 group-hover:text-zinc-900 transition-all duration-500 group-hover:scale-125`}
                >
                  {name}
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default function CompanyLogos() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.filter((c: Customer) => c.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }
    fetchCustomers();
  }, []);

  // Split customers into 3 rows for the ticker
  const row1 = customers.slice(0, Math.ceil(customers.length / 3));
  const row2 = customers.slice(Math.ceil(customers.length / 3), Math.ceil(customers.length * 2 / 3));
  const row3 = customers.slice(Math.ceil(customers.length * 2 / 3));

  const r1 = row1;
  const r2 = row2;
  const r3 = row3;

  return (
    <section className="py-28 relative overflow-hidden bg-zinc-50 border-y border-zinc-200">
      {/* Subtle Ambient Lighting Layers */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-100 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[800px] h-[800px] bg-accent/5 blur-[140px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="container mx-auto px-6 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${spaceGrotesk.className} space-y-4`}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            Global Partnership
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 uppercase">
            Brands We Work With
          </h2>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-col gap-12 opacity-90 transition-opacity duration-1000">
        <TickerRow items={r1} speed={30} direction="left" fontClass={spaceGrotesk.className} />
        <TickerRow items={r2} speed={40} direction="right" fontClass={spaceGrotesk.className} />
        <TickerRow items={r3} speed={25} direction="left" fontClass={spaceGrotesk.className} />
      </div>
    </section>
  );
}