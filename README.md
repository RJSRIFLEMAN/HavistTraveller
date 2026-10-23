# Havist Traveller

Website perjalanan B2B/B2C berbahasa Indonesia. Paket wisata dan armada dikelola di Sanity Studio; API Next.js menyediakan pencarian, formulir konsultasi, dan pengiriman proposal. Data lead dan konsultasi disimpan di PostgreSQL melalui Prisma.

## Persyaratan

- Node.js 22.18 atau lebih baru
- npm
- Docker Desktop (untuk PostgreSQL lokal), atau PostgreSQL yang dapat diakses aplikasi
- Project Sanity dan akun Resend untuk mengaktifkan CMS serta email

## Menjalankan secara lokal

1. Instal dependencies: `npm ci`.
2. Salin `.env.example` menjadi `.env`, lalu perbarui nilai yang diperlukan. Jangan commit `.env` atau mengirim kredensial lewat chat.
3. Jalankan PostgreSQL lokal: `docker compose up -d`.
4. Generate Prisma Client: `npm run db:generate`.
5. Terapkan skema database: `npm run db:deploy`.
6. Jalankan aplikasi: `npm run dev`.
7. Buka `http://localhost:3000`. CMS berada di `/studio`.

Jika tidak menggunakan Docker, arahkan `DATABASE_URL` ke PostgreSQL Anda sebelum menjalankan migrasi. `npm run db:studio` membuka Prisma Studio untuk melihat data lokal.

## Konfigurasi layanan

### Sanity

Buat project Sanity dan dataset, lalu isi `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, dan `NEXT_PUBLIC_SANITY_API_VERSION`. Untuk dataset privat, tambahkan token baca ke `SANITY_API_READ_TOKEN`. Masuk ke `/studio` untuk membuat dan menerbitkan dokumen **Paket Wisata** serta **Armada**. Field yang wajib dan struktur itinerary/fasilitas dijelaskan di skema Sanity pada `src/sanity/schemaTypes`.

### Resend

Verifikasi domain pengirim di Resend. Isi `RESEND_API_KEY` dan `RESEND_FROM` dengan alamat pengirim terverifikasi. Atur `INQUIRY_TO` sebagai alamat tim yang menerima permintaan konsultasi. Untuk proposal, `PROPOSAL_URL` harus berupa URL HTTPS publik ke PDF. `NEXT_PUBLIC_PROPOSAL_URL` adalah tautan yang terlihat pada halaman dan harus menunjuk ke proposal yang sama.

Untuk `LEAD_RATE_LIMIT_SECRET`, gunakan nilai acak minimal 32 karakter. Di produksi, atur `NEXT_PUBLIC_SITE_URL` ke origin publik, pastikan reverse proxy menyediakan header alamat klien tepercaya yang didukung (`x-vercel-forwarded-for` atau `cf-connecting-ip`), dan jangan percaya header IP dari klien langsung.

## Skrip

- `npm run dev` — server pengembangan
- `npm run build` — generate Prisma Client dan build Next.js
- `npm start` — jalankan build produksi
- `npm test` — tes unit dan validasi
- `npm run lint` — ESLint
- `npx tsc --noEmit` — pemeriksaan TypeScript
- `npm run db:deploy` — terapkan migrasi yang tersedia
- `npm run db:migrate` — buat migrasi saat pengembangan

## Deployment

Konfigurasikan environment variable produksi, jalankan `npm run db:deploy` sebelum aplikasi menerima trafik, lalu build dan jalankan dengan `npm run build` serta `npm start`. Pastikan platform hosting menerima PDF proposal berukuran sekitar 39 MB di `public/proposal-havist-2025.pdf`; bila batas aset hosting lebih rendah, unggah PDF ke penyimpanan publik dan arahkan kedua URL proposal ke sana.

Variabel environment layanan eksternal belum disertakan. Tanpa PostgreSQL, Sanity, dan Resend yang dikonfigurasi, katalog CMS, penyimpanan formulir, dan email otomatis tidak akan berfungsi; antarmuka menyediakan status/kontak alternatif yang sesuai.
