import { createHmac } from "node:crypto";

export function getTrustedClientAddress(
  headers: Headers,
  environment = process.env.NODE_ENV,
): string | null {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 100);

  if (environment !== "production") {
    const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwardedFor) return forwardedFor.slice(0, 100);
  }

  return null;
}

export function createLeadRateLimitKey(address: string, secret: string): string {
  return createHmac("sha256", secret).update(address).digest("hex");
}
