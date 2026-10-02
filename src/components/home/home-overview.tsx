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
            <img
              src="/api/images/homepageimages/image1.png?v=2"
              alt="FIDA Global team member"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('/homepg%20bento.jpg')) {
                  target.src = '/homepg%20bento.jpg';
                }
              }}
            />
            
          </div>
          <div className="home-bento__stat home-bento__stat--green" style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/api/images/homepageimages/clients.png" alt="370+ Clients" className="absolute inset-0 w-full h-full object-cover z-0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          </div>
        </div>

        <div className="home-bento__col home-bento__col--2">
          <div className="home-bento__stat home-bento__stat--blue" style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/api/images/homepageimages/coutries.png" alt="4+ Countries" className="absolute inset-0 w-full h-full object-cover z-0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          </div>
          <div className="home-bento__media home-bento__photo--product">
            <img src="/api/images/homepageimages/image2.png" alt="FIDA Global product experience" loading="lazy" />
          </div>
        </div>

        <div className="home-bento__col home-bento__col--3">
          <div className="home-bento__stat home-bento__stat--outline">
            <strong><Counter value={50} suffix="K+" /></strong>
            <span>Uptime Cloud<br/>Payroll Employees</span>
          </div>
          <div className="home-bento__stat home-bento__stat--yellow" style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/api/images/homepageimages/products.png" alt="10+ Products" className="absolute inset-0 w-full h-full object-cover z-0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          </div>
        </div>

        <div className="home-bento__right">
          <div className="home-bento__media home-bento__photo--desk">
            <img
              src="/api/images/homepageimages/upendra_portrait.jpg?v=1"
              alt="Upendra Wickramatunga - Managing Director"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('/ourteam/upendra.png')) {
                  target.src = '/api/images/ourteam/upendra.png';
                }
              }}
            />
          </div>
          <div className="home-bento__stat home-bento__stat--red" style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/api/images/homepageimages/years.png" alt="15+ Years Experience" className="absolute inset-0 w-full h-full object-cover z-0" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          </div>
          <div className="home-bento__media home-bento__photo--office">
            <img
              src="/api/images/homepageimages/image04.jpeg?v=2"
              alt="FIDA Global office"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('/homepg%20bento4.jpg')) {
                  target.src = '/homepg%20bento4.jpg';
                }
              }}
            />
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
                alt="FIDA Global platform dashboards and employee portal" loading="lazy"
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
            <div className="w-full pb-10 sm:pb-14 px-2 sm:px-4">
              <div className="home-logo-cloud mx-auto" style={{ aspectRatio: '2.3/1', height: 'auto', maxWidth: '1000px', width: '100%', marginTop: '1.5rem', paddingTop: '1rem', paddingBottom: '2.5rem' }}>
                {(() => {
                // Precision 29-item non-overlapping OVAL grid.
                // Ordered from CENTER-OUTWARDS so fewer customers always form a dense core.
                // Hexagonal/honeycomb staggered distribution guarantees zero overlap between any items.
                const POSITIONS = [
                  // --- CENTER CORE (1) ---
                  { left: '43.1%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I4

                  // --- INNER RING (6) ---
                  { left: '37.1%', top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I3
                  { left: '51.4%', top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I4
                  { left: '37.1%', top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I3
                  { left: '51.4%', top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I4
                  { left: '29.4%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I3
                  { left: '56.8%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I5

                  // --- MIDDLE RING (12) ---
                  { left: '22.8%', top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I2
                  { left: '65.7%', top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I5
                  { left: '22.8%', top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I2
                  { left: '65.7%', top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I5
                  { left: '15.7%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I2
                  { left: '70.5%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I6
                  { left: '44.4%', top: '3.5%',  width: '11.8%', aspect: '1.95' }, // R1 I3
                  { left: '44.4%', top: '81.5%', width: '11.8%', aspect: '1.95' }, // R5 I3
                  { left: '30.2%', top: '3.5%',  width: '11.8%', aspect: '1.95' }, // R1 I2
                  { left: '58.6%', top: '3.5%',  width: '11.8%', aspect: '1.95' }, // R1 I4
                  { left: '30.2%', top: '81.5%', width: '11.8%', aspect: '1.95' }, // R5 I2
                  { left: '58.6%', top: '81.5%', width: '11.8%', aspect: '1.95' }, // R5 I4

                  // --- OUTER EDGE (10) ---
                  { left: '2.0%',  top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I1
                  { left: '84.2%', top: '42.5%', width: '11.8%', aspect: '1.95' }, // R3 I7
                  { left: '8.5%',  top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I1
                  { left: '80.0%', top: '23.0%', width: '11.8%', aspect: '1.95' }, // R2 I6
                  { left: '8.5%',  top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I1
                  { left: '80.0%', top: '62.0%', width: '11.8%', aspect: '1.95' }, // R4 I6
                  { left: '16.0%', top: '3.5%',  width: '11.8%', aspect: '1.95' }, // R1 I1
                  { left: '72.8%', top: '3.5%',  width: '11.8%', aspect: '1.95' }, // R1 I5
                  { left: '16.0%', top: '81.5%', width: '11.8%', aspect: '1.95' }, // R5 I1
                  { left: '72.8%', top: '81.5%', width: '11.8%', aspect: '1.95' }  // R5 I5
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
                        padding: 'clamp(4px, 1.1vw, 13px)',
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

      </div>
    </motion.section>
  );
}
