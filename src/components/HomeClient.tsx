"use client";

import { useCallback, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { FleetShowcase } from "@/components/FleetShowcase";
import { HeroSection } from "@/components/HeroSection";
import { InquiryForm } from "@/components/InquiryForm";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { PackageCatalog } from "@/components/PackageCatalog";
import { PackageDetailsDialog } from "@/components/PackageDetailsDialog";
import { PartnerDirectory } from "@/components/PartnerDirectory";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ValueGrid } from "@/components/ValueGrid";
import type { PackageSearchParams } from "@/lib/package-query";
import { travelPackagesSchema, type FleetItem, type TravelPackage } from "@/lib/travel-content-schema";

interface HomeClientProps {
  initialPackages: TravelPackage[];
  initialFleet: FleetItem[];
  cmsConfigured: boolean;
  contentStatus: "ready" | "not-configured" | "unavailable";
  proposalUrl: string;
}

function readErrorMessage(value: unknown, fallback: string): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "message" in value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }
  return fallback;
}

const defaultFilters: PackageSearchParams = {
  destination: "ALL",
  category: "ALL",
  durationDays: "ALL",
  search: "",
};

export function HomeClient({
  initialPackages,
  initialFleet,
  cmsConfigured,
  contentStatus,
  proposalUrl,
}: HomeClientProps) {
  const [packages, setPackages] = useState(initialPackages);
  const fleet = initialFleet;
  const [filters, setFilters] = useState(defaultFilters);
  const [status, setStatus] = useState(contentStatus);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const destinations = [...new Set(initialPackages.map((item) => item.destination))].sort();

  const searchPackages = useCallback(async (nextFilters: PackageSearchParams) => {
    setFilters(nextFilters);
    setSearchError(null);
    const params = new URLSearchParams();
    if (nextFilters.destination !== "ALL") params.set("destination", nextFilters.destination);
    if (nextFilters.category !== "ALL") params.set("category", nextFilters.category);
    if (nextFilters.durationDays !== "ALL") params.set("durationDays", String(nextFilters.durationDays));
    if (nextFilters.search) params.set("search", nextFilters.search);

    try {
      const response = await fetch(`/api/packages?${params.toString()}`, {
        cache: "no-store",
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        throw new Error(readErrorMessage(body, "Paket belum dapat dimuat."));
      }
      if (typeof body !== "object" || body === null || !("data" in body)) {
        throw new Error("Respons katalog tidak valid.");
      }
      const result = travelPackagesSchema.safeParse(body.data);
      if (!result.success) throw new Error("Data katalog tidak valid.");
      setPackages(result.data);
      setStatus("ready");
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "Paket belum dapat dimuat. Periksa koneksi lalu coba kembali.",
      );
    }
  }, []);

  const retrySearch = useCallback(() => {
    void searchPackages(filters);
  }, [filters, searchPackages]);

  const openPackage = useCallback((travelPackage: TravelPackage) => {
    setSelectedPackage(travelPackage);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection
          destinations={destinations}
          cmsConfigured={cmsConfigured}
          onSearch={searchPackages}
        />
        <section className="story-section section-pad" aria-labelledby="story-title">
          <div className="story-index">
            <span className="eyebrow"><span className="eyebrow-mark" /> CERITA PERJALANAN ANDA</span>
            <span className="story-index-number">01 — 04</span>
          </div>
          <div className="story-copy">
            <h2 id="story-title">Perjalanan yang hebat<br />selalu dimulai dari <em>mimpi.</em></h2>
            <p>
              Kami merangkai paket, armada, dan pengalaman dalam satu perjalanan yang terasa
              pas untuk sekolah, keluarga, dan perusahaan Anda.
            </p>
            <a className="story-link" href="#paket">Kenali cara kami merencanakan perjalanan <span aria-hidden="true">↗</span></a>
          </div>
          <div className="story-stamp" aria-hidden="true">
            <span>PERGI</span><span>BERSAMA</span><strong>↗</strong>
          </div>
        </section>

        <ValueGrid />
        <PackageCatalog
          packages={packages}
          cmsConfigured={cmsConfigured}
          contentStatus={status}
          error={searchError}
          onRetry={retrySearch}
          onOpen={openPackage}
        />
        <FleetShowcase fleet={fleet} cmsConfigured={cmsConfigured} />
        <PartnerMarquee />
        <PartnerDirectory />
        <section className="consultation-strip section-pad" aria-labelledby="consultation-title">
          <span className="consultation-orbit" aria-hidden="true">HT</span>
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" /> ROMBONGAN ANDA PUNYA CERITANYA SENDIRI</p>
            <h2 id="consultation-title">Kami bantu wujudkan <em>rencananya.</em></h2>
          </div>
          <a
            className="consultation-link"
            href={`https://wa.me/62895338599354?text=${encodeURIComponent("Halo Havist Traveller, saya ingin konsultasi paket wisata...")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi gratis <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </section>
        <InquiryForm />
        <LeadMagnetForm proposalUrl={proposalUrl} />
      </main>
      <SiteFooter />
      <a
        className="whatsapp-float"
        href={`https://wa.me/62895338599354?text=${encodeURIComponent("Halo Havist Traveller, saya ingin konsultasi paket wisata...")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi paket wisata melalui WhatsApp"
      >
        <span className="whatsapp-ripple" aria-hidden="true" />
        <MessageCircle size={22} aria-hidden="true" />
        <span>Chat kami</span>
      </a>
      <PackageDetailsDialog selected={selectedPackage} onClose={() => setSelectedPackage(null)} />
    </>
  );
}
