"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  id: number;
  name: string;
  logo_url: string | null;
  order_index: number;
  status: string;
}

const fallbackCustomers = [
  "Commercial Insurance", "ACL", "SAS", "Kelani Cables", "Abans",
  "Köhl", "SkyNet", "Ceylon Solutions", "Restaurent", "EMG Logistics",
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

export default function HomeOverview() {
  const reduceMotion = useReducedMotion();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Customer[]) =>
        setCustomers(
          data
            .filter((customer) => customer.status === "Active" && customer.logo_url)
            .sort((a, b) => a.order_index - b.order_index)
        )
      )
      .catch(() => setCustomers([]));
  }, []);

  const brands = customers.length ? customers : fallbackCustomers;

  return (
    <motion.section
      id="home-content"
      className="home-overview"
      initial={reduceMotion ? false : { opacity: 0.82, y: 110, scale: 0.988 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="home-technology !mt-0 !pt-12">
        <motion.h2
          className="text-4xl md:text-5xl font-black text-[#052c65] uppercase tracking-tighter text-center mb-16"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Digital Backbone for Borderless Workforce
        </motion.h2>

        <motion.div
          className="relative mx-auto w-[94%] max-w-[1040px] aspect-[1.58] mt-12 flex items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Dashboard cluster mockup */}
          <div className="absolute left-0 top-[2%] w-[82%] rounded-[2rem] overflow-hidden border border-[#052c65]/8 shadow-[0_24px_60px_rgba(5,44,101,0.12)] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_36px_75px_rgba(5,44,101,0.18)]">
            <img 
              src="/images/homepageimages/image5.png" 
              alt="FIDA Global dashboard suite" 
              className="w-full h-auto block"
            />
          </div>

          {/* Overlapping Mobile Portal mockup */}
          <div className="absolute right-0 bottom-[2%] w-[23%] rounded-[2.2rem] overflow-hidden border-[5px] border-white shadow-[0_30px_55px_rgba(5,44,101,0.22)] bg-white transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_40px_70px_rgba(5,44,101,0.3)]">
            <img 
              src="/images/homepageimages/IMG_8542.PNG" 
              alt="FIDA Global mobile employee portal" 
              className="w-full h-auto block"
            />
          </div>
        </motion.div>
      </div>

      <div className="home-trust">
        <p className="home-section-kicker">CUSTOMER NETWORK</p>
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted by market leaders worldwide.
        </motion.h2>
        <div className="home-logo-cloud">
          {brands.map((brand, index) => {
            const customer = typeof brand === "string" ? null : brand;
            const name = typeof brand === "string" ? brand : brand.name;
            return (
              <motion.div
                key={typeof brand === "string" ? brand : brand.id}
                className="home-logo-card"
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.035, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                {customer?.logo_url ? <img src={customer.logo_url} alt={name} /> : <span>{name}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      <section className="home-fragmentation">
        <motion.div
          className="home-fragmentation__copy"
          initial={reduceMotion ? false : { opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className="home-section-kicker">BUILT FOR BORDERLESS OPERATIONS</p>
          <h2>Running a workforce across <span>borders</span> should not feel complicated.</h2>
          <p>Growth crosses borders easily. Your systems should too. Bring payroll, people data, compliance, and operations into one dependable layer.</p>
          <Link href="/solutions" className="home-fragmentation__link">
            THIS IS WHERE FRAGMENTATION ENDS <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <motion.div
          className="home-fragmentation__network"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          aria-label="Disconnected workforce systems becoming one connected platform"
        >
          <svg viewBox="0 0 620 390" aria-hidden="true">
            <path d="M95 90 L302 190 L520 70 M302 190 L515 300 M302 190 L98 310" />
            <circle cx="95" cy="90" r="6" /><circle cx="520" cy="70" r="6" />
            <circle cx="302" cy="190" r="11" className="hub" />
            <circle cx="515" cy="300" r="6" /><circle cx="98" cy="310" r="6" />
          </svg>
          <span className="home-network-label home-network-label--one">Payroll delays</span>
          <span className="home-network-label home-network-label--two">Scattered employee data</span>
          <span className="home-network-label home-network-label--three">Compliance risk</span>
          <span className="home-network-label home-network-label--four">Disconnected systems</span>
          <div className="home-network-hub"><strong>FIDA</strong><small>One connected layer</small></div>
        </motion.div>
      </section>
    </motion.section>
  );
}
