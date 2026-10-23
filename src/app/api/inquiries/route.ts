import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { consumeLeadRateLimit, createLeadRateLimitKey, getTrustedClientAddress } from "@/lib/lead-abuse";
import { inquiryInputSchema } from "@/lib/inquiry-input";
import { prisma } from "@/lib/prisma";

const MAX_REQUEST_BYTES = 8 * 1024;

function apiError(status: number, code: string, message: string, headers?: HeadersInit) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM;
  const recipient = process.env.INQUIRY_TO;
  const rateLimitSecret = process.env.LEAD_RATE_LIMIT_SECRET;

  if (
    !process.env.DATABASE_URL ||
    !apiKey ||
    apiKey.includes("replace-with") ||
    !sender ||
    sender.includes("your-verified-domain.com") ||
    !recipient ||
    recipient.includes("replace-with") ||
    !rateLimitSecret
  ) {
    return apiError(
      503,
      "INQUIRY_SERVICE_NOT_CONFIGURED",
      "Form konsultasi belum siap. Silakan hubungi Havist Traveller melalui WhatsApp.",
    );
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return apiError(415, "UNSUPPORTED_MEDIA_TYPE", "Kirim data menggunakan format JSON.");
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return apiError(413, "REQUEST_TOO_LARGE", "Ukuran data formulir melebihi batas.");
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return apiError(400, "INVALID_REQUEST", "Data formulir tidak dapat dibaca.");
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return apiError(413, "REQUEST_TOO_LARGE", "Ukuran data formulir melebihi batas.");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return apiError(400, "INVALID_JSON", "Data formulir tidak valid.");
  }

  const parsed = inquiryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INQUIRY",
          message: "Periksa email, detail perjalanan, dan persetujuan Anda.",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (parsed.data.website) {
    return apiError(400, "INVALID_INQUIRY", "Permintaan tidak dapat diproses.");
  }

  const clientAddress = getTrustedClientAddress(request.headers);
  if (!clientAddress || rateLimitSecret.length < 32) {
    return apiError(
      503,
      "INQUIRY_SERVICE_NOT_CONFIGURED",
      "Form konsultasi belum siap. Silakan hubungi Havist Traveller melalui WhatsApp.",
    );
  }

  try {
    const rateLimit = await consumeLeadRateLimit(
      createLeadRateLimitKey(clientAddress, rateLimitSecret),
    );
    if (!rateLimit.allowed) {
      return apiError(
        429,
        "TOO_MANY_REQUESTS",
        "Terlalu banyak permintaan. Silakan coba kembali beberapa menit lagi.",
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }
  } catch {
    console.error("[api/inquiries] Rate-limit storage failed.");
    return apiError(
      503,
      "INQUIRY_SERVICE_UNAVAILABLE",
      "Form konsultasi sedang tidak tersedia. Silakan coba kembali.",
    );
  }

  let inquiry;
  try {
    inquiry = await prisma.inquiry.create({
      data: {
        email: parsed.data.email,
        message: parsed.data.message,
        type: parsed.data.type,
        consentedAt: new Date(),
      },
      select: { id: true },
    });
  } catch {
    console.error("[api/inquiries] Inquiry persistence failed.");
    return apiError(
      503,
      "INQUIRY_STORAGE_UNAVAILABLE",
      "Pesan belum dapat disimpan. Silakan coba kembali atau hubungi kami melalui WhatsApp.",
    );
  }

  const resend = new Resend(apiKey);
  try {
    const delivery = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: parsed.data.email,
      subject: `Konsultasi perjalanan Havist Traveller — ${parsed.data.type}`,
      text: [
        `Jenis perjalanan: ${parsed.data.type}`,
        `Email pemohon: ${parsed.data.email}`,
        "",
        "Detail perjalanan:",
        parsed.data.message,
      ].join("\n"),
    });

    if (delivery.error) {
      throw new Error("Resend rejected the inquiry notification.");
    }
  } catch {
    try {
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { status: "NOTIFICATION_FAILED" },
      });
    } catch {
      console.error("[api/inquiries] Failed to record the notification failure.");
    }
    console.error("[api/inquiries] Resend request failed.");
    return apiError(
      502,
      "INQUIRY_NOTIFICATION_FAILED",
      "Pesan tersimpan, tetapi notifikasi belum terkirim. Silakan hubungi kami melalui WhatsApp.",
    );
  }

  try {
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "NOTIFIED" },
    });
  } catch {
    console.error("[api/inquiries] Notification was accepted, but inquiry status could not be updated.");
  }

  return NextResponse.json(
    { data: { message: "Terima kasih! Tim Havist Traveller akan menghubungi Anda." } },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
