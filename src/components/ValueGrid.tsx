"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgePercent,
  Camera,
  CircleDollarSign,
  Gift,
  Headset,
  Wallet,
} from "lucide-react";

const benefits = [
  { icon: Wallet, title: "DP 0%", detail: "Mulai merencanakan perjalanan tanpa beban uang muka." },
  { icon: CircleDollarSign, title: "Harga bersaing", detail: "Pilihan perjalanan yang pas dengan anggaran rombongan." },
  { icon: BadgePercent, title: "Cashback seru", detail: "Kesempatan hemat tambahan untuk perjalanan pilihan." },
  { icon: Gift, title: "Free voucher", detail: "Bonus kecil yang membuat liburan terasa lebih spesial." },
  { icon: Headset, title: "Tour leader", detail: "Ada pendamping untuk bantu rombongan tetap nyaman." },
  { icon: Camera, title: "Dokumentasi premium", detail: "Momen perjalanan diabadikan untuk dikenang bersama." },
];

export function ValueGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="value-section section-pad" aria-labelledby="benefits-title">
      <div className="section-heading">
        <p className="eyebrow"><span className="eyebrow-mark" /> LEBIH DARI SEKADAR JALAN-JALAN</p>
        <h2 id="benefits-title">Detail kecil. <em>Kenangan besar.</em></h2>
        <p className="section-lead">
          Dari perencanaan sampai perjalanan pulang, semua dibuat lebih mudah bersama.
        </p>
      </div>
      <div className="benefit-grid">
        {benefits.map(({ icon: Icon, title, detail }, index) => (
          <motion.article
            className={`benefit-card benefit-card--${index + 1}`}
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.06 }}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -5 }}
          >
            <span className="benefit-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{detail}</p>
            <span className="benefit-index">0{index + 1}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
