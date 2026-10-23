"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const inquiryTypes = [
  { value: "EDUCATION", label: "Wisata edukasi" },
  { value: "RECREATION", label: "Wisata rekreasi" },
  { value: "GRADUATION", label: "Wisata wisuda" },
  { value: "CORPORATE", label: "Perjalanan perusahaan" },
] as const;

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

export function InquiryForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<(typeof inquiryTypes)[number]["value"]>("EDUCATION");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, type, consent, website }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setNotice({
          kind: "error",
          message: readApiMessage(result, "Pesan belum berhasil dikirim. Silakan coba kembali."),
        });
        return;
      }

      setEmail("");
      setMessage("");
      setConsent(false);
      setNotice({
        kind: "success",
        message: "Terima kasih! Tim Havist Traveller akan menghubungi Anda.",
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
    <section className="inquiry-section section-pad" id="konsultasi" aria-labelledby="inquiry-title">
      <div className="inquiry-copy">
        <p className="eyebrow"><span className="eyebrow-mark" /> CERITAKAN RENCANA ANDA</p>
        <h2 id="inquiry-title">Perjalanan Anda, <em>kami dengarkan.</em></h2>
        <p>
          Bagikan gambaran perjalanan Anda. Tim kami akan menghubungi melalui email untuk
          membantu merancang perjalanan yang sesuai.
        </p>
        <a
          className="inquiry-whatsapp"
          href={`https://wa.me/62895338599354?text=${encodeURIComponent("Halo Havist Traveller, saya ingin konsultasi paket wisata...")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Atau chat langsung melalui WhatsApp <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <form className="inquiry-form glass-card" onSubmit={submit}>
        <div className="inquiry-form-row">
          <label htmlFor="inquiry-email">Email untuk dihubungi</label>
          <input
            id="inquiry-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="inquiry-form-row">
          <label htmlFor="inquiry-type">Jenis perjalanan</label>
          <select
            id="inquiry-type"
            value={type}
              onChange={(event) => {
                const selected = inquiryTypes.find((item) => item.value === event.target.value);
                if (selected) setType(selected.value);
              }}
          >
            {inquiryTypes.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="inquiry-form-row">
          <label htmlFor="inquiry-message">Apa yang Anda rencanakan?</label>
          <textarea
            id="inquiry-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={10}
            maxLength={2000}
            placeholder="Ceritakan destinasi, perkiraan tanggal, jumlah peserta, atau kebutuhan khusus."
            required
          />
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="inquiry-website">Leave this field empty</label>
          <input
            id="inquiry-website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        <label className="consent-label inquiry-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
          />
          <span>Saya setuju Havist Traveller menggunakan email dan pesan ini untuk menanggapi konsultasi saya.</span>
        </label>
        <button className="lead-submit" type="submit" disabled={pending}>
          {pending ? <span className="spinner" aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
          {pending ? "Mengirim pesan…" : "Kirim permintaan konsultasi"}
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
        <p className="lead-privacy">Data Anda hanya digunakan untuk menanggapi konsultasi ini.</p>
      </form>
    </section>
  );
}
