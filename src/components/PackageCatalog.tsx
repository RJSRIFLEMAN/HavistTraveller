import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import type { TravelPackage } from "@/lib/travel-content";

interface PackageCatalogProps {
  packages: TravelPackage[];
  cmsConfigured: boolean;
  contentStatus: "ready" | "not-configured" | "unavailable";
  error: string | null;
  onRetry: () => void;
  onOpen: (travelPackage: TravelPackage) => void;
}

const categoryLabels: Record<TravelPackage["category"], string> = {
  EDUCATION: "Edukasi",
  RECREATION: "Rekreasi",
  GRADUATION: "Wisuda",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function PackageCatalog({
  packages,
  cmsConfigured,
  contentStatus,
  error,
  onRetry,
  onOpen,
}: PackageCatalogProps) {
  return (
    <section className="catalog-section section-pad" id="paket" aria-labelledby="packages-title">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark" /> PAKET PILIHAN HAVIST</p>
          <h2 id="packages-title">Destinasi yang<br /><em>punya cerita.</em></h2>
        </div>
        <p className="section-lead">
          Perjalanan edukasi, rekreasi, dan wisuda yang disusun untuk dinikmati bersama.
        </p>
      </div>

      {error && (
        <div className="catalog-status catalog-status--error" role="alert">
          <p>{error}</p>
          <button className="text-button" type="button" onClick={onRetry}>Coba lagi</button>
        </div>
      )}

      {!error && contentStatus === "not-configured" && (
        <div className="catalog-status" role="status">
          <p>Katalog paket akan tampil setelah Sanity CMS terhubung dan paket dipublikasikan.</p>
          <a className="text-button" href="#proposal">Tanyakan perjalanan Anda <ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      )}

      {!error && contentStatus === "unavailable" && (
        <div className="catalog-status catalog-status--error" role="alert">
          <p>Katalog belum dapat dimuat dari CMS.</p>
          <button className="text-button" type="button" onClick={onRetry}>Coba lagi</button>
        </div>
      )}

      {!error && cmsConfigured && packages.length === 0 && (
        <div className="catalog-status" role="status">
          <p>Belum ada paket aktif yang cocok. Coba ubah filter atau publikasikan paket di Sanity Studio.</p>
          <Link className="text-button" href="/studio">Buka Sanity Studio <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      )}

      {packages.length > 0 && (
        <div className="package-grid">
          {packages.map((travelPackage, index) => (
            <article
              className={`package-card ${index === 1 ? "package-card--feature" : ""}`}
              key={travelPackage._id}
            >
              <button
                className="package-card-image"
                type="button"
                onClick={() => onOpen(travelPackage)}
                aria-label={`Lihat detail ${travelPackage.title}`}
              >
                <Image
                  src={travelPackage.coverImage.url}
                  alt={travelPackage.coverImage.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 32vw"
                />
                <span className="package-badge">{categoryLabels[travelPackage.category]}</span>
                <span className="package-open" aria-hidden="true"><ArrowRight size={18} /></span>
              </button>
              <div className="package-card-copy">
                <div className="package-meta">
                  <span><MapPin size={13} aria-hidden="true" /> {travelPackage.destination}</span>
                  <span><Clock3 size={13} aria-hidden="true" /> {travelPackage.durationDays} hari</span>
                </div>
                <h3>{travelPackage.title}</h3>
                <p>{travelPackage.excerpt}</p>
                <div className="package-card-bottom">
                  <span className="package-price">
                    {travelPackage.originalPrice && (
                      <del>{rupiah.format(travelPackage.originalPrice)}</del>
                    )}
                    <strong>{rupiah.format(travelPackage.startPrice)}</strong>
                    <small>/ orang</small>
                  </span>
                  <button type="button" className="package-detail-link" onClick={() => onOpen(travelPackage)}>
                    Detail <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
