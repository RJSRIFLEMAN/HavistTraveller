import { ArrowUpRight, MoveUp } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <>
      <svg
        className="footer-wave"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 52c224 68 425-33 670-21 257 12 426 88 770 15v64H0Z" />
      </svg>
      <footer className="site-footer">
        <div className="footer-main">
          <a className="wordmark footer-wordmark" href="#top" aria-label="Havist Traveller, kembali ke atas">
            <span className="wordmark-symbol" aria-hidden="true">h</span>
            <span className="wordmark-copy"><strong>HAVIST</strong><small>TRAVELLER</small></span>
          </a>
          <p className="footer-tagline">Your Travel Dream Makers.</p>
          <div className="footer-links">
            <a href="#paket">Paket wisata</a>
            <a href="#armada">Armada</a>
            <a href="#proposal">Unduh proposal</a>
            <a href="#konsultasi">Konsultasi</a>
            <Link href="/studio">Admin CMS <ArrowUpRight size={13} aria-hidden="true" /></Link>
          </div>
          <a className="back-top" href="#top">KEMBALI KE ATAS <MoveUp size={14} aria-hidden="true" /></a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Havist Traveller</span>
          <span>Dirancang untuk perjalanan yang lebih berarti.</span>
          <span>INDONESIA <span aria-hidden="true">✳</span></span>
        </div>
      </footer>
    </>
  );
}
