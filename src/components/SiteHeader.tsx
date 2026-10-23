"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

const navigation = [
  { href: "#paket", label: "Paket wisata" },
  { href: "#armada", label: "Armada" },
  { href: "#mitra", label: "Mitra" },
  { href: "#konsultasi", label: "Konsultasi" },
];

export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (value) => setCompact(value > 36));

  return (
    <motion.header
      className={`site-header ${compact ? "site-header--compact" : ""}`}
      style={{ x: "-50%" }}
      animate={{ y: reduceMotion ? 0 : compact ? 10 : 20 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <a className="wordmark" href="#top" aria-label="Havist Traveller, kembali ke beranda">
        <span className="wordmark-symbol" aria-hidden="true">h</span>
        <span className="wordmark-copy">
          <strong>HAVIST</strong>
          <small>TRAVELLER</small>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
      <nav
        className={`site-navigation ${menuOpen ? "site-navigation--open" : ""}`}
        id="site-navigation"
        aria-label="Navigasi utama"
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="header-proposal" href="#proposal" onClick={() => setMenuOpen(false)}>
          Unduh proposal <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </motion.header>
  );
}
