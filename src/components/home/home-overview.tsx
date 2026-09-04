"use client";

import { motion, useReducedMotion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { runDirectionalPageTransition } from "@/lib/directional-page-transition";

function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string, prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => prefix + Math.round(latest) + suffix);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
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
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fragmentationRef = useRef<HTMLElement>(null);



  useEffect(() => {
    fetch("/api/customers")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Customer[]) =>
        setCustomers(
          data
            .filter((customer) => customer.status === "Active")
            .sort((a, b) => a.order_index - b.order_index)
        )
      )
      .catch(() => setCustomers([]));
  }, []);



  return (
    <motion.section
      id="home-content"
      className="home-overview"
      initial={reduceMotion ? false : { opacity: 0.82, y: 110, scale: 0.988 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="home-bento"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-bento__col home-bento__col--1">
          <div className="home-bento__media home-bento__photo--woman">
            <img src="/api/images/homepageimages/image1.png" alt="FIDA Global team member" />
          </div>
          <div className="home-bento__stat home-bento__stat--green">
            <span><strong><Counter value={370} suffix="+" /></strong> Clients</span>
          </div>
        </div>

        <div className="home-bento__col home-bento__col--2">
          <div className="home-bento__stat home-bento__stat--blue">
            <span><strong><Counter value={4} /></strong> Countries</span>
          </div>
          <div className="home-bento__media home-bento__photo--product">
            <img src="/api/images/homepageimages/image2.png" alt="FIDA Global product experience" />
          </div>
        </div>

        <div className="home-bento__col home-bento__col--3">
          <div className="home-bento__stat home-bento__stat--outline">
            <strong><Counter value={50} suffix="K+" /></strong>
            <span>Uptime Cloud<br/>Payroll Employees</span>
          </div>
          <div className="home-bento__stat home-bento__stat--yellow">
            <strong><Counter value={10} suffix=" +" /></strong>
            <span>Products</span>
          </div>
        </div>

        <div className="home-bento__right">
          <div className="home-bento__media home-bento__photo--desk">
            <img src="/api/images/homepageimages/image3.png" alt="FIDA Global consultant" />
          </div>
          <div className="home-bento__stat home-bento__stat--red">
            <span><strong><Counter value={14} suffix="+" /></strong> Years Experience</span>
          </div>
          <div className="home-bento__media home-bento__photo--office">
            <img src="/api/images/homepageimages/image04.jpeg" alt="FIDA Global office" />
          </div>
        </div>
      </motion.div>


      <div className="home-showcase-wrapper">
        <div className="home-showcase">
          <div className="home-technology">
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The Digital Backbone for Borderless Workforce
            </motion.h2>

            <motion.div
              className="home-technology__showcase"
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/api/images/homepageimages/frame04.png"
                alt="FIDA Global platform dashboards and employee portal"
              />
            </motion.div>
          </div>

          <div className="home-trust">
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Trusted by market leaders worldwide.
            </motion.h2>
            <div className="w-full pb-4 px-2 sm:px-4">
              <div className="home-logo-cloud mx-auto" style={{ aspectRatio: '2.5/1', height: 'auto', maxWidth: '1000px', width: '100%', marginTop: '3rem' }}>
                {(() => {
                // Precision 29-item OVAL grid.
                // Ordered from CENTER-OUTWARDS. This guarantees that if there are fewer than 29 customers,
                // they will form a perfectly dense core in the middle of the screen without any empty holes,
                // eliminating the need for duplicates!
                const POSITIONS = [
                  // --- CENTER CORE (1) ---
                  { left: '42%', top: '44%', width: '14%', aspect: '3.0' }, // R3 I4

                  // --- INNER RING (6) ---
                  { left: '35%', top: '22%', width: '12%', aspect: '1.2' }, // R2 I3
                  { left: '49%', top: '20%', width: '15%', aspect: '2.5' }, // R2 I4
                  { left: '36%', top: '58%', width: '16%', aspect: '2.8' }, // R4 I3
                  { left: '54%', top: '60%', width: '13%', aspect: '1.5' }, // R4 I4
                  { left: '29%', top: '46%', width: '11%', aspect: '1.5' }, // R3 I3
                  { left: '58%', top: '46%', width: '11%', aspect: '1.2' }, // R3 I5

                  // --- MIDDLE RING (12) ---
                  { left: '13%', top: '41%', width: '14%', aspect: '2.2' }, // R3 I2
                  { left: '71%', top: '41%', width: '13%', aspect: '1.8' }, // R3 I6
                  { left: '19%', top: '21%', width: '15%', aspect: '2.8' }, // R2 I2
                  { left: '65%', top: '25%', width: '13%', aspect: '1.5' }, // R2 I5
                  { left: '22%', top: '61%', width: '12%', aspect: '1.5' }, // R4 I2
                  { left: '69%', top: '65%', width: '14%', aspect: '2.5' }, // R4 I5
                  { left: '42%', top: '5%',  width: '16%', aspect: '2.8' }, // R1 I3
                  { left: '46%', top: '86%', width: '12%', aspect: '1.5' }, // R5 I3
                  { left: '28%', top: '1%',  width: '12%', aspect: '1.4' }, // R1 I2
                  { left: '60%', top: '2%',  width: '13%', aspect: '1.5' }, // R1 I4
                  { left: '29%', top: '81%', width: '15%', aspect: '2.8' }, // R5 I2
                  { left: '60%', top: '80%', width: '15%', aspect: '2.5' }, // R5 I4

                  // --- OUTER EDGE (10) ---
                  { left: '1%',  top: '45%', width: '11%', aspect: '1.2' }, // R3 I1
                  { left: '86%', top: '44%', width: '12%', aspect: '1.5' }, // R3 I7
                  { left: '5%',  top: '24%', width: '13%', aspect: '1.5' }, // R2 I1
                  { left: '80%', top: '22%', width: '15%', aspect: '2.5' }, // R2 I6
                  { left: '6%',  top: '64%', width: '14%', aspect: '2.2' }, // R4 I1
                  { left: '85%', top: '62%', width: '11%', aspect: '1.2' }, // R4 I6
                  { left: '12%', top: '4%',  width: '14%', aspect: '2.2' }, // R1 I1
                  { left: '75%', top: '4%',  width: '14%', aspect: '2.2' }, // R1 I5
                  { left: '14%', top: '84%', width: '13%', aspect: '1.8' }, // R5 I1
                  { left: '77%', top: '85%', width: '13%', aspect: '1.8' }  // R5 I5
                ];

                if (!customers || customers.length === 0) return null;

                // Render EXACTLY the customers we have (no duplicates!)
                const displayCustomers = customers.slice(0, 29);

                return displayCustomers.map((customer, i) => {
                  const pos = POSITIONS[i];
                  return (
                    <motion.div
                      key={`${customer.id}-${i}`}
                      className="home-logo-card"
                      data-customer-name={customer.name}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, duration: 0.6 }}
                      style={{ 
                        left: pos.left,
                        top: pos.top,
                        width: pos.width,
                        aspectRatio: pos.aspect,
                        padding: 'clamp(3px, 1vw, 12px)',
                        zIndex: 10 + i
                      }}
                    >
                      {customer.logo_url ? (
                        <img src={customer.logo_url} alt={customer.name} loading="lazy" />
                      ) : (
                        <span className="text-[6px] sm:text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center w-full truncate leading-tight">
                          {customer.name}
                        </span>
                      )}
                    </motion.div>
                  );
                });
              })()}
              </div>
            </div>
          </div>
        </div>

        <section ref={fragmentationRef} className="home-fragmentation home-fragmentation--homepage">
          <motion.div
            className="home-fragmentation__copy"
            initial={reduceMotion ? false : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <h2>Running a workforce across <span>borders</span> shouldn&apos;t feel this complicated.</h2>
            <p>Growth crosses borders easily. Your systems don&apos;t. Most HR platforms weren&apos;t built to hold local compliance and global scale in the same hand.</p>
          </motion.div>

          <motion.div
            className="home-fragmentation__network"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            aria-label="Disconnected workforce systems"
          >
            <svg viewBox="0 0 760 470" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <radialGradient id="dot-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" className="dot-gradient-center" />
                  <stop offset="100%" className="dot-gradient-edge" />
                </radialGradient>
              </defs>
              <path d="M88 360 L420 194" />
              <path d="M8 277 L684 382" />
              <path d="M548 62 L682 298" />
              <path d="M506 300 L735 111" />
              <ellipse className="home-network-dot" cx="88" cy="360" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="420" cy="194" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="8" cy="277" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="684" cy="382" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="548" cy="62" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="682" cy="298" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="506" cy="300" rx="2.6" ry="6" fill="url(#dot-gradient)" />
              <ellipse className="home-network-dot" cx="735" cy="111" rx="2.6" ry="6" fill="url(#dot-gradient)" />
            </svg>
            <span className="home-network-label home-network-label--payroll">Payroll that takes days</span>
            <span className="home-network-label home-network-label--employee">Employee data<br />scattered across five<br />disconnected tools</span>
            <span className="home-network-label home-network-label--compliance">Compliance rules that<br />change faster than<br />you can track</span>
            <span className="home-network-label home-network-label--systems">Systems that don&apos;t<br />talk to each other</span>
          </motion.div>

          <a
            href="#smart-hris-hero"
            className="home-fragmentation__link home-fragmentation__link--centered"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("smart-hris-hero")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            THIS IS WHERE FRAGMENTATION ENDS.
          </a>
        </section>

      </div>
    </motion.section>
  );
}
