"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BusFront, Users } from "lucide-react";
import { A11y, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { FleetItem } from "@/lib/travel-content";

interface FleetShowcaseProps {
  fleet: FleetItem[];
  cmsConfigured: boolean;
}

export function FleetShowcase({ fleet, cmsConfigured }: FleetShowcaseProps) {
  return (
    <section className="fleet-section section-pad" id="armada" aria-labelledby="fleet-title">
      <div className="fleet-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-mark" /> PERJALANAN NYAMAN DIMULAI DI SINI</p>
          <h2 id="fleet-title">Perjalanan jauh,<br /><em>tetap terasa dekat.</em></h2>
        </div>
        <p className="section-lead">
          Armada pilihan untuk menjaga perjalanan rombongan tetap nyaman, dari berangkat sampai pulang.
        </p>
      </div>

      {fleet.length > 0 ? (
        <div className="fleet-carousel-wrap">
          <Swiper
            className="fleet-swiper"
            modules={[EffectCoverflow, Navigation, Pagination, A11y]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            loop={fleet.length > 2}
            grabCursor
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 180,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={{ prevEl: ".fleet-prev", nextEl: ".fleet-next" }}
            pagination={{ clickable: true, el: ".fleet-pagination" }}
            a11y={{
              prevSlideMessage: "Armada sebelumnya",
              nextSlideMessage: "Armada berikutnya",
            }}
          >
            {fleet.map((vehicle) => (
              <SwiperSlide className="fleet-slide" key={vehicle._id}>
                <article className="fleet-card">
                  <Image
                    src={vehicle.coverImage.url}
                    alt={vehicle.coverImage.alt}
                    fill
                    sizes="(max-width: 700px) 88vw, 65vw"
                  />
                  <div className="fleet-card-overlay">
                    <span className="fleet-chip"><BusFront size={14} aria-hidden="true" /> ARMADA HAVIST</span>
                    <div className="fleet-card-info">
                      <div>
                        <p>{vehicle.model}</p>
                        <h3>{vehicle.name}</h3>
                      </div>
                      <span className="fleet-capacity"><Users size={16} aria-hidden="true" /> {vehicle.capacity} kursi</span>
                    </div>
                    <div className="fleet-tooltip" tabIndex={0}>
                      <span>Fasilitas armada</span>
                      <ul>{vehicle.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fleet-controls">
            <button className="fleet-control fleet-prev" type="button" aria-label="Armada sebelumnya">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <div className="fleet-pagination" />
            <button className="fleet-control fleet-next" type="button" aria-label="Armada berikutnya">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="fleet-empty" role="status">
          <span className="fleet-empty-icon"><BusFront size={24} aria-hidden="true" /></span>
          <div>
            <h3>{cmsConfigured ? "Armada pilihan segera hadir." : "Armada tampil setelah CMS terhubung."}</h3>
            <p>
              {cmsConfigured
                ? "Tim Havist sedang menyiapkan armada yang dapat dipilih untuk perjalanan Anda."
                : "Tambahkan foto, kapasitas, dan fasilitas armada melalui Sanity Studio."}
            </p>
          </div>
          {cmsConfigured && <Link href="/studio">Kelola armada <ArrowRight size={15} aria-hidden="true" /></Link>}
        </div>
      )}
    </section>
  );
}
