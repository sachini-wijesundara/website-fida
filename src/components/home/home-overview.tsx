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

const row1Config = [
  { id: 6, key: "cable", name: "Cable Solutions" },
  { id: 21, key: "ruhunu", name: "Ruhunu" },
  { id: 3, key: "commercial", name: "Commercial Insurance" },
  { id: 2, key: "monaro", name: "Monaro" },
  { id: 23, key: "lmsl", name: "lmsl" }
];

const row2Config = [
  { id: 1, key: "aban", name: "Abans" },
  { id: 25, key: "acl", name: "ACL" },
  { id: 22, key: "sas", name: "SAS" },
  { id: 4, key: "sipway", name: "Sipway" },
  { id: 20, key: "uwu", name: "UWU" },
  { id: 5, key: "rotax", name: "Rotax Limited" },
  { id: 18, key: "emg", name: "EMG Logistics" }
];

const row3Config = [
  { id: 27, key: "kalani", name: "Kelani Cables" },
  { id: 17, key: "kablr", name: "kablr" },
  { id: 24, key: "sky", name: "SkyNet" }
];

export default function HomeOverview() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fragmentationRef = useRef<HTMLElement>(null);
  const hasOpenedSmartHris = useRef(false);

  const markFragmentationTransition = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasOpenedSmartHris.current) return;
    hasOpenedSmartHris.current = true;
    runDirectionalPageTransition({
      direction: "forward",
      destination: "/smart-hris",
      navigate: () => router.push("/smart-hris", { scroll: false }),
    });
  };

  useEffect(() => {
    router.prefetch("/smart-hris");
  }, [router]);

  useEffect(() => {
    const openFromDownwardScroll = (event: WheelEvent) => {
      const fragmentation = fragmentationRef.current;
      if (!fragmentation || event.deltaY <= 4 || hasOpenedSmartHris.current) return;
      const bounds = fragmentation.getBoundingClientRect();
      const isAtFragmentationEnd = bounds.top < window.innerHeight && bounds.bottom <= window.innerHeight + 120;
      if (!isAtFragmentationEnd) return;

      hasOpenedSmartHris.current = true;
      runDirectionalPageTransition({
        direction: "forward",
        destination: "/smart-hris",
        navigate: () => router.push("/smart-hris", { scroll: false }),
      });
    };

    document.addEventListener("wheel", openFromDownwardScroll, { passive: true, capture: true });
    return () => document.removeEventListener("wheel", openFromDownwardScroll, { capture: true });
  }, [router]);

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

  const findCustomer = (id: number, keyword: string) => {
    let found = customers.find(c => c.id === id);
    if (!found) {
      found = customers.find(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    return found;
  };

  const renderLogoCard = (customer: Customer | undefined, fallbackName: string, index: number, rowNum: number) => {
    const name = customer ? customer.name : fallbackName;
    return (
      <motion.div
        key={`${rowNum}-${index}-${name}`}
        className="home-logo-card"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (rowNum * 4 + index) * 0.03, duration: 0.45 }}
      >
        {customer?.logo_url ? (
          <img src={customer.logo_url} alt={name} />
        ) : (
          <span>{name}</span>
        )}
      </motion.div>
    );
  };

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
            <div className="home-logo-cloud">
              <div className="home-logo-row home-logo-row--1">
                {row1Config.map((item, index) => {
                  const customer = findCustomer(item.id, item.key);
                  return renderLogoCard(customer, item.name, index, 1);
                })}
              </div>
              <div className="home-logo-row home-logo-row--2">
                {row2Config.map((item, index) => {
                  const customer = findCustomer(item.id, item.key);
                  return renderLogoCard(customer, item.name, index, 2);
                })}
              </div>
              <div className="home-logo-row home-logo-row--3">
                {row3Config.map((item, index) => {
                  const customer = findCustomer(item.id, item.key);
                  return renderLogoCard(customer, item.name, index, 3);
                })}
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

          <Link
            href="/smart-hris"
            onClick={markFragmentationTransition}
            className="home-fragmentation__link home-fragmentation__link--centered"
          >
            THIS IS WHERE FRAGMENTATION ENDS.
          </Link>
        </section>

      </div>
    </motion.section>
  );
}
