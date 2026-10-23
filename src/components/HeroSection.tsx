"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, MapPin, Search } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const busY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 42]);

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
      <motion.div className="hero-bus" style={{ y: busY }} aria-hidden="true">
        <BusIllustration />
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

function BusIllustration() {
  return (
    <svg viewBox="0 0 1180 470" role="img" aria-label="Siluet ilustrasi bus wisata premium">
      <defs>
        <linearGradient id="bus-glass" x1="0" x2="0.85" y1="0" y2="1">
          <stop offset="0" stopColor="#a9e3ed" stopOpacity=".9" />
          <stop offset="1" stopColor="#567f98" stopOpacity=".85" />
        </linearGradient>
        <linearGradient id="bus-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f7fbfc" />
          <stop offset=".22" stopColor="#d8e2e5" />
          <stop offset=".66" stopColor="#244054" />
          <stop offset=".69" stopColor="#e1ad55" />
          <stop offset="1" stopColor="#172a3a" />
        </linearGradient>
        <filter id="bus-blur">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>
      <ellipse cx="594" cy="412" rx="500" ry="31" fill="#040d17" opacity=".64" filter="url(#bus-blur)" />
      <path
        d="M123 361V192c0-45 28-82 70-91 196-42 513-52 754-30 71 6 117 62 120 141l7 149c1 19-14 35-33 35H155c-18 0-32-15-32-35Z"
        fill="url(#bus-body)"
        stroke="#d8edf0"
        strokeOpacity=".76"
        strokeWidth="6"
      />
      <path d="M147 192c1-34 20-60 53-68 194-41 498-48 744-29 54 4 85 37 94 88l3 18H147Z" fill="#13283b" />
      <path d="M167 187c3-25 16-42 41-48 47-10 104-17 162-23v82H167Z" fill="url(#bus-glass)" />
      <path d="M388 114c81-7 169-11 251-10v94H388Z" fill="url(#bus-glass)" />
      <path d="M657 105c93 1 187 5 279 14 36 4 61 24 73 59l5 20H657Z" fill="url(#bus-glass)" />
      <path d="M376 112v88m270-95v96" stroke="#172b3a" strokeWidth="10" />
      <path d="M147 219h972" stroke="#f6fbfb" strokeOpacity=".6" strokeWidth="3" />
      <path d="M124 318c228 21 661 26 945 3" fill="none" stroke="#f3bd66" strokeWidth="9" />
      <path d="M128 333c224 18 659 20 940 0" fill="none" stroke="#0e2332" strokeOpacity=".68" strokeWidth="4" />
      <path d="M137 286h19m980 0h19" stroke="#e6f2f3" strokeLinecap="round" strokeWidth="9" />
      <rect x="1037" y="246" width="23" height="54" rx="8" fill="#e85b4d" />
      <rect x="133" y="256" width="10" height="47" rx="5" fill="#f7bd61" />
      <path d="M250 267h150m16 0h69m26 0h252" stroke="#d3e2e6" strokeOpacity=".18" strokeWidth="4" />
      <circle cx="322" cy="354" r="62" fill="#101c29" stroke="#768c98" strokeWidth="7" />
      <circle cx="322" cy="354" r="35" fill="#bac7cb" />
      <circle cx="322" cy="354" r="16" fill="#526675" />
      <circle cx="951" cy="354" r="62" fill="#101c29" stroke="#768c98" strokeWidth="7" />
      <circle cx="951" cy="354" r="35" fill="#bac7cb" />
      <circle cx="951" cy="354" r="16" fill="#526675" />
      <path d="M472 72c97-8 191-9 275-4" fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth="3" />
      <text x="574" y="276" fill="#eaf3f4" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" letterSpacing="8">HAVIST TRAVEL</text>
    </svg>
  );
}
