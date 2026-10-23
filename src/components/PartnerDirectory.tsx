"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { filterPartners, partners } from "../../catalog.mjs";

interface PartnerDirectoryEntry {
  name: string;
  url: string;
}

export function PartnerDirectory() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const matchingPartners: PartnerDirectoryEntry[] = useMemo(
    () => filterPartners(partners, query),
    [query],
  );

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target;
      if (
        event.key === "/" &&
        !(target instanceof HTMLElement &&
          (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true']")))
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <section className="partner-directory section-pad" aria-labelledby="providers-title">
      <div className="directory-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark" /> JARINGAN TRANSPORTASI</p>
          <h2 id="providers-title">Teman perjalanan<br /><em>yang siap berangkat.</em></h2>
        </div>
        <label className="directory-search">
          <span className="visually-hidden">Cari mitra transportasi</span>
          <Search size={17} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama armada"
            autoComplete="off"
          />
          <kbd>/</kbd>
        </label>
      </div>
      <div className="directory-summary">
        <span>{matchingPartners.length} mitra transportasi</span>
        <span>DETAIL MITRA TERSIMPAN DI GOOGLE DRIVE</span>
      </div>
      {matchingPartners.length > 0 ? (
        <ul className="provider-grid" aria-label="Daftar mitra transportasi">
          {matchingPartners.map((partner) => (
            <li className="provider-item" key={partner.name}>
              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                <span>{partner.name}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="directory-empty" role="status">Mitra tidak ditemukan. Coba kata kunci lain.</p>
      )}
      <p className="directory-note">Informasi mitra akan terbuka melalui Google Drive dan mungkin memerlukan akses.</p>
    </section>
  );
}
