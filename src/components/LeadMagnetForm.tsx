"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface LeadMagnetFormProps {
  proposalUrl: string;
}

function readApiMessage(value: unknown, fallback: string): string {
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

export function LeadMagnetForm({ proposalUrl }: LeadMagnetFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setNotice({
          kind: "error",
          message: readApiMessage(result, "Proposal belum berhasil dikirim. Silakan coba kembali."),
        });
        return;
      }
      setEmail("");
      setConsent(false);
      setNotice({
        kind: "success",
        message: "Proposal telah dikirim ke email Anda!",
      });
    } catch {
      setNotice({
        kind: "error",
        message: "Koneksi terputus. Periksa internet lalu coba kembali.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="lead-section section-pad" id="proposal" aria-labelledby="proposal-title">
      <div className="lead-orbit lead-orbit--one" aria-hidden="true" />
      <div className="lead-orbit lead-orbit--two" aria-hidden="true" />
      <div className="lead-copy">
        <p className="eyebrow"><span className="eyebrow-mark" /> BAWA IDE PERJALANAN PULANG</p>
        <h2 id="proposal-title">Mulai dari<br /><em>sebuah rencana.</em></h2>
        <p>Unduh proposal Havist Traveller dan temukan inspirasi untuk perjalanan berikutnya.</p>
        <a className="lead-direct-link" href={proposalUrl} target="_blank" rel="noopener noreferrer">
          Lihat proposal sekarang <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <form className="lead-form glass-card" onSubmit={submit}>
        <span className="lead-form-number">HT · TRAVEL IDEAS</span>
        <h3>Kirim proposal ke email Anda.</h3>
        <label htmlFor="lead-email">Alamat email</label>
        <input
          id="lead-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={254}
          placeholder="nama@email.com"
          autoComplete="email"
          required
        />
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="lead-website">Leave this field empty</label>
          <input
            id="lead-website"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        <label className="consent-label">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
          />
          <span>Saya setuju menerima proposal ini melalui email. Email hanya digunakan untuk mengirim permintaan ini.</span>
        </label>
        <button className="lead-submit" type="submit" disabled={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
          {pending ? "Mengirim proposal…" : "Unduh proposal"}
        </button>
        {notice && (
          <p
            className={`lead-notice lead-notice--${notice.kind}`}
            role={notice.kind === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {notice.kind === "success" && <CheckCircle2 size={16} aria-hidden="true" />}
            {notice.message}
          </p>
        )}
        <p className="lead-privacy">Tidak ada email marketing. Hanya proposal yang Anda minta.</p>
      </form>
    </section>
  );
}
