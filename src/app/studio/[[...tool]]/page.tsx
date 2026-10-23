import { isSanityConfigured } from "@/lib/sanity";
import { StudioClient } from "@/components/StudioClient";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main className="studio-not-configured">
        <h1>Sanity Studio belum dikonfigurasi</h1>
        <p>
          Isi <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> dan
          <code> NEXT_PUBLIC_SANITY_DATASET</code> pada file <code>.env.local</code>,
          lalu buka kembali halaman ini.
        </p>
      </main>
    );
  }

  return <StudioClient />;
}
