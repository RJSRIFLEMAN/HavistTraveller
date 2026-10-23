import type { Metadata } from "next";
import "./globals.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Havist Traveller | Your Travel Dream Makers",
  description:
    "Paket wisata, perjalanan rombongan, dan armada yang dirancang khusus. Mulai rencanakan perjalanan Anda bersama Havist Traveller.",
  applicationName: "Havist Traveller",
  openGraph: {
    title: "Havist Traveller | Your Travel Dream Makers",
    description: "Perjalanan yang berkesan dimulai bersama orang-orang terbaik.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
