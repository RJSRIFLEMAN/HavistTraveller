import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadInputSchema } from "@/lib/lead-input";
import { consumeLeadRateLimit, createLeadRateLimitKey, getTrustedClientAddress } from "@/lib/lead-abuse";
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
  const rateLimitSecret = process.env.LEAD_RATE_LIMIT_SECRET;
  const proposalUrl = process.env.PROPOSAL_URL;

  if (
    !process.env.DATABASE_URL ||
    !apiKey ||
    apiKey.includes("replace-with") ||
    !sender ||
    sender.includes("your-verified-domain.com") ||
    !rateLimitSecret ||
    !proposalUrl ||
    proposalUrl.includes("replace-with")
  ) {
    return apiError(
      503,
      "LEAD_SERVICE_NOT_CONFIGURED",
      "Form proposal belum siap. Silakan hubungi Havist Traveller melalui WhatsApp.",
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

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_LEAD",
          message: "Masukkan email yang valid dan setujui pengiriman proposal.",
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
    return apiError(400, "INVALID_LEAD", "Permintaan tidak dapat diproses.");
  }

  const clientAddress = getTrustedClientAddress(request.headers);
  if (!clientAddress || rateLimitSecret.length < 32) {
    return apiError(
      503,
      "LEAD_SERVICE_NOT_CONFIGURED",
      "Form proposal belum siap. Silakan hubungi Havist Traveller melalui WhatsApp.",
    );
  }

  const rateLimitKey = createLeadRateLimitKey(clientAddress, rateLimitSecret);
  let rateLimit: Awaited<ReturnType<typeof consumeLeadRateLimit>>;
  try {
    rateLimit = await consumeLeadRateLimit(rateLimitKey);
  } catch {
    console.error("[api/leads] Rate-limit storage failed.");
    return apiError(
      503,
      "LEAD_SERVICE_UNAVAILABLE",
      "Form proposal sedang tidak tersedia. Silakan coba kembali.",
    );
  }

  if (!rateLimit.allowed) {
    return apiError(
      429,
      "TOO_MANY_REQUESTS",
      "Terlalu banyak permintaan. Silakan coba kembali beberapa menit lagi.",
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let lead: { id: string };
  try {
    lead = await prisma.lead.create({
      data: {
        email: parsed.data.email,
        consentedAt: new Date(),
      },
      select: { id: true },
    });
  } catch {
    console.error("[api/leads] Lead persistence failed.");
    return apiError(
      503,
      "LEAD_STORAGE_UNAVAILABLE",
      "Data belum dapat disimpan. Silakan coba kembali.",
    );
  }

  const resend = new Resend(apiKey);
  let delivery;
  try {
    delivery = await resend.emails.send({
      from: sender,
      to: parsed.data.email,
      subject: "Proposal perjalanan dari Havist Traveller",
      text: [
        "Terima kasih telah menghubungi Havist Traveller.",
        "Proposal perjalanan Anda dapat diunduh melalui tautan berikut:",
        proposalUrl,
        "",
        "Tim kami siap membantu merencanakan perjalanan Anda.",
      ].join("\n"),
    });
  } catch {
    await markLeadDeliveryFailed(lead.id);
    console.error("[api/leads] Resend request failed.");
    return apiError(
      502,
      "PROPOSAL_DELIVERY_FAILED",
      "Proposal belum berhasil dikirim. Silakan coba kembali atau hubungi kami melalui WhatsApp.",
    );
  }

  if (delivery.error) {
    await markLeadDeliveryFailed(lead.id);
    console.error("[api/leads] Resend rejected the proposal email.");
    return apiError(
      502,
      "PROPOSAL_DELIVERY_FAILED",
      "Proposal belum berhasil dikirim. Silakan coba kembali atau hubungi kami melalui WhatsApp.",
    );
  }

  async function markLeadDeliveryFailed(id: string) {
    try {
      await prisma.lead.update({
        where: { id },
        data: { deliveryStatus: "FAILED" },
      });
    } catch {
      console.error("[api/leads] Failed to record the proposal delivery failure.");
    }
  }

  try {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        deliveryStatus: "SENT",
        proposalSentAt: new Date(),
      },
    });
  } catch {
    console.error("[api/leads] Proposal was accepted, but delivery status could not be updated.");
  }

  return NextResponse.json(
    { data: { message: "Proposal telah dikirim ke email Anda!" } },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
