"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Cloud, Loader2 } from "lucide-react";

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  highlights?: string;
  image_url?: string;
  dashboard_image_url?: string;
  mobile_image_url?: string;
  website_url?: string;
  status: string;
}

const fallbackDashboard = "/images/homepageimages/image5.png";
const fallbackMobile = "/images/homepageimages/IMG_8542.PNG";

export default function SmartHrisClient() {
  const reduceMotion = useReducedMotion();
  const [product, setProduct] = useState<Product | null>(null);
  const [others, setOthers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.ok ? response.json() : [])
      .then((items: Product[]) => {
        const current = items.find((item) => item.title.toLowerCase().includes("smart hris")) || null;
        setProduct(current);
        setOthers(items.filter((item) => item.status === "Active" && item.id !== current?.id).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  const highlights = (() => {
    if (!product?.highlights) return ["Unified payroll", "Real-time attendance", "Employee self-service", "Workforce analytics"];
    try {
      const parsed = JSON.parse(product.highlights);
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch {
      return product.highlights.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 4);
    }
  })();

  if (loading) {
    return (
      <main className="smart-hris-page min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-[#159bb4]" size={38} />
      </main>
    );
  }

  const dashboardImage = product?.dashboard_image_url || fallbackDashboard;
  const mobileImage = product?.mobile_image_url || fallbackMobile;

  return (
    <main className="smart-hris-page min-h-screen">
      <section className="smart-hris-hero">
        <div className="smart-hris-hero__wash" aria-hidden="true" />
        <motion.div
          className="smart-hris-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="smart-hris-brand"><span>One ecosystem.</span> SmartHRIS <Cloud size={30} /></p>
          <h1>Every layer of your workforce, <span>covered.</span></h1>
          <p className="smart-hris-copy__intro">
            {product?.description || "Connect people, payroll, attendance, and workforce intelligence through one dependable enterprise layer."}
          </p>
          <div className="smart-hris-highlights">
            {highlights.map((item) => <span key={item}><Check size={14} />{item}</span>)}
          </div>
          <Link href="/contact" className="smart-hris-button">Request a demo <ArrowRight size={18} /></Link>
        </motion.div>

        <div className="smart-hris-product-stage">
          <motion.div
            className="smart-hris-dashboard-shot"
            initial={reduceMotion ? false : { opacity: 0, y: 70, scale: .92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: .2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={dashboardImage} alt="Smart HRIS workforce analytics dashboard" />
          </motion.div>
          <motion.div
            className="smart-hris-mobile-shot"
            initial={reduceMotion ? false : { opacity: 0, x: -70, y: 45, rotate: -5 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={{ duration: .9, delay: .55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduceMotion ? undefined : { y: -10, rotate: -1 }}
          >
            <img src={mobileImage} alt="Smart HRIS mobile attendance application" />
          </motion.div>
          <svg className="smart-hris-connector" viewBox="0 0 1000 540" aria-hidden="true">
            <path d="M80 470 C170 470 150 390 240 390 M795 240 C880 240 850 330 950 330" />
          </svg>
        </div>
      </section>

      <section className="home-fragmentation smart-hris-fragmentation">
        <motion.div
          className="home-fragmentation__copy"
          initial={reduceMotion ? false : { opacity: 0, x: -42 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: .3 }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="home-section-kicker">Built for borderless operations</p>
          <h2>Running a workforce across <span>borders</span> should not feel complicated.</h2>
          <p>Growth crosses borders easily. Your systems should too. Bring payroll, people data, compliance, and operations into one dependable layer.</p>
          <Link href="/contact" className="home-fragmentation__link">
            This is where fragmentation ends <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <motion.div
          className="home-fragmentation__network"
          initial={reduceMotion ? false : { opacity: 0, scale: .9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: .35 }}
          transition={{ duration: .85, delay: .12, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Disconnected workforce systems becoming one connected FIDA platform"
        >
          <motion.svg viewBox="0 0 620 390" aria-hidden="true">
            {[
              "M95 90 L302 190",
              "M302 190 L520 70",
              "M302 190 L515 300",
              "M302 190 L98 310",
            ].map((path, index) => (
              <motion.path
                key={path}
                d={path}
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: .8, delay: .35 + index * .12 }}
              />
            ))}
            <circle cx="95" cy="90" r="6" /><circle cx="520" cy="70" r="6" />
            <circle cx="302" cy="190" r="11" className="hub" />
            <circle cx="515" cy="300" r="6" /><circle cx="98" cy="310" r="6" />
          </motion.svg>
          <span className="home-network-label home-network-label--one">Payroll delays</span>
          <span className="home-network-label home-network-label--two">Scattered employee data</span>
          <span className="home-network-label home-network-label--three">Compliance risk</span>
          <span className="home-network-label home-network-label--four">Disconnected systems</span>
          <motion.div
            className="home-network-hub"
            initial={reduceMotion ? false : { opacity: 0, scale: .7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: .65, delay: .55, type: "spring" }}
          >
            <strong>FIDA</strong><small>One connected layer</small>
          </motion.div>
        </motion.div>
      </section>

      <section className="smart-hris-other" id="other-solutions">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="smart-hris-other__heading"
        >
          <p>FIDA product ecosystem</p>
          <h2>Other solutions</h2>
        </motion.div>
        <div className="smart-hris-other__grid">
          {others.map((item, index) => {
            const href = item.website_url || `/solutions#${item.id}`;
            const external = /^https?:\/\//i.test(href);
            return (
              <motion.article
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .25 }}
                transition={{ delay: index * .08 }}
                className="smart-hris-solution-card"
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle || item.description}</p>
                  <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                    Learn more <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="smart-hris-solution-card__media">
                  {item.image_url && <img src={item.image_url} alt="" />}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
