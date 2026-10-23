"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Clock3, MapPin, X } from "lucide-react";
import type { TravelPackage } from "@/lib/travel-content";
import { travelPackageSchema } from "@/lib/travel-content-schema";

interface PackageDetailsDialogProps {
  selected: TravelPackage | null;
  onClose: () => void;
}

interface PackageDetailState {
  slug: string;
  data?: TravelPackage;
  error?: string;
}

export function PackageDetailsDialog({ selected, onClose }: PackageDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "facilities">("itinerary");
  const [detailState, setDetailState] = useState<PackageDetailState | null>(null);
  const activeDetail = selected && detailState?.slug === selected.slug ? detailState : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;

    const controller = new AbortController();

    fetch(`/api/packages/${encodeURIComponent(selected.slug)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const body: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof body.error === "object" &&
            body.error !== null &&
            "message" in body.error &&
            typeof body.error.message === "string"
              ? body.error.message
              : "Detail paket belum dapat dimuat.";
          throw new Error(message);
        }
        if (
          typeof body !== "object" ||
          body === null ||
          !("data" in body)
        ) {
          throw new Error("Respons detail paket tidak valid.");
        }
        const parsed = travelPackageSchema.safeParse(body.data);
        if (!parsed.success) throw new Error("Data detail paket tidak valid.");
        setDetailState({ slug: selected.slug, data: parsed.data });
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setDetailState({
          slug: selected.slug,
          error: requestError instanceof Error
            ? requestError.message
            : "Detail paket belum dapat dimuat.",
        });
      });

    return () => controller.abort();
  }, [selected]);

  return (
    <dialog
      className="package-dialog"
      ref={dialogRef}
      aria-labelledby="package-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Tutup detail paket">
        <X size={20} aria-hidden="true" />
      </button>
      {selected && (
        <div className="dialog-layout">
          <div className="dialog-image">
            <Image src={selected.coverImage.url} alt={selected.coverImage.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />
          </div>
          <div className="dialog-content">
            <p className="eyebrow"><span className="eyebrow-mark" /> {selected.destination.toUpperCase()}</p>
            <h2 id="package-dialog-title">{activeDetail?.data?.title ?? selected.title}</h2>
            <p className="dialog-summary">{activeDetail?.data?.excerpt ?? selected.excerpt}</p>
            <div className="dialog-facts">
              <span><MapPin size={15} aria-hidden="true" /> {selected.destination}</span>
              <span><Clock3 size={15} aria-hidden="true" /> {selected.durationDays} hari</span>
            </div>
            <div className="dialog-tabs" aria-label="Informasi paket">
              <button
                type="button"
                aria-pressed={activeTab === "itinerary"}
                onClick={() => setActiveTab("itinerary")}
              >
                Itinerary
              </button>
              <button
                type="button"
                aria-pressed={activeTab === "facilities"}
                onClick={() => setActiveTab("facilities")}
              >
                Fasilitas
              </button>
            </div>
            {selected && !activeDetail && <p className="dialog-state" role="status">Memuat detail perjalanan…</p>}
            {activeDetail?.error && <p className="dialog-state dialog-state--error" role="alert">{activeDetail.error}</p>}
            {activeDetail?.data && activeTab === "itinerary" && (
              <ol className="itinerary-list">
                {activeDetail.data.itinerary.map((day) => (
                  <li key={`${day.day}-${day.title}`}>
                    <span className="day-number">HARI {day.day}</span>
                    <h3>{day.title}</h3>
                    <ul>{day.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
                  </li>
                ))}
              </ol>
            )}
            {activeDetail?.data && activeTab === "facilities" && (
              <ul className="facilities-list">
                {activeDetail.data.facilities.map((facility) => (
                  <li key={facility}><Check size={16} aria-hidden="true" /> {facility}</li>
                ))}
              </ul>
            )}
            {selected && (
              <a
                className="dialog-cta"
                href={`https://wa.me/62895338599354?text=${encodeURIComponent(`Halo Havist Traveller, saya ingin konsultasi paket wisata ${selected.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi paket ini <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
