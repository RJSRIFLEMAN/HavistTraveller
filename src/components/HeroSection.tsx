"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, MapPin, Search } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import type { PackageSearchParams } from "@/lib/package-query";

interface HeroSectionProps {
  destinations: string[];
  cmsConfigured: boolean;
  onSearch: (filters: PackageSearchParams) => Promise<void>;
}

export function HeroSection({ destinations, cmsConfigured, onSearch }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [destination, setDestination] = useState("ALL");
  const [durationDays, setDurationDays] = useState<number | "8+" | "ALL">("ALL");
  const [category, setCategory] = useState<PackageSearchParams["category"]>("ALL");
  const [searching, setSearching] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 125]);
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 42]);

  async function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    try {
      await onSearch({
        destination,
        durationDays,
        category,
        search: "",
      });
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <motion.div className="hero-landscape" style={{ y: backgroundY }} aria-hidden="true" />
      <div className="hero-atmosphere" aria-hidden="true" />
      <motion.div className="hero-mascot" style={{ y: mascotY }}>
        <Image
          className="hero-mascot-image"
          src="/MascootBadak.png?v=20261025"
          alt="Maskot badak Havist Traveller membawa koper dan bendera."
          width={1080}
          height={1080}
          sizes="(max-width: 640px) 50vw, (max-width: 900px) 48vw, 40vw"
          priority
        />
      </motion.div>
      <div className="hero-content">
        <p className="hero-kicker"><span /> TEMUKAN CARA BARU UNTUK PERGI BERSAMA</p>
        <h1 id="hero-title">Your Travel<br /><em>Dream Makers.</em></h1>
        <p className="hero-description">
          Dari perjalanan sekolah sampai liburan perusahaan — kami bantu setiap detailnya.
        </p>
        <a className="hero-scroll-link" href="#paket">
          Mulai temukan perjalanan <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="hero-caption" aria-hidden="true">
        <span className="caption-rule" />
        <span>Perjalanan Indonesia,<br />dirancang bersama.</span>
      </div>
      <div className="hero-side-index" aria-hidden="true">HT / 01</div>

      <form className="search-dock" onSubmit={submitSearch} aria-label="Cari paket wisata">
        <label className="search-field search-field--destination">
          <span className="search-label"><MapPin size={14} aria-hidden="true" /> DESTINASI</span>
          <select
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            disabled={!cmsConfigured}
          >
            <option value="ALL">Semua destinasi</option>
            {destinations.map((place) => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
        </label>
        <label className="search-field">
          <span className="search-label">DURASI</span>
          <select
            value={durationDays}
            onChange={(event) => {
              const value = event.target.value;
              setDurationDays(value === "ALL" || value === "8+" ? value : Number(value));
            }}
            disabled={!cmsConfigured}
          >
            <option value="ALL">Semua durasi</option>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>{day} hari</option>
            ))}
            <option value="8+">8+ hari</option>
          </select>
        </label>
        <label className="search-field">
          <span className="search-label">KATEGORI</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as PackageSearchParams["category"])}
            disabled={!cmsConfigured}
          >
            <option value="ALL">Semua kategori</option>
            <option value="EDUCATION">Edukasi</option>
            <option value="RECREATION">Rekreasi</option>
            <option value="GRADUATION">Wisuda</option>
          </select>
        </label>
        <button className="search-submit" type="submit" disabled={!cmsConfigured || searching}>
          {searching ? <span className="spinner" aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
          <span>{searching ? "Mencari" : "Cari paket"}</span>
          {!searching && <ArrowUpRight size={17} aria-hidden="true" />}
        </button>
        {!cmsConfigured && (
          <p className="search-notice" role="status">Katalog akan aktif setelah CMS terhubung.</p>
        )}
      </form>
      <span className="hero-bottom-note" aria-hidden="true">JAVA · BALI · NUSANTARA</span>
    </section>
  );
}
