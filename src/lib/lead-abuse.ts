import { prisma } from "@/lib/prisma";
export { createLeadRateLimitKey, getTrustedClientAddress } from "@/lib/lead-abuse-identity";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export async function consumeLeadRateLimit(key: string, now = new Date()) {
  const windowCutoff = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
  const rows = await prisma.$queryRaw<Array<{ requestCount: number }>>`
    INSERT INTO "LeadRateLimit" ("key", "requestCount", "windowStartedAt", "updatedAt")
    VALUES (${key}, 1, ${now}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "requestCount" = CASE
        WHEN "LeadRateLimit"."windowStartedAt" <= ${windowCutoff} THEN 1
        ELSE "LeadRateLimit"."requestCount" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "LeadRateLimit"."windowStartedAt" <= ${windowCutoff} THEN ${now}
        ELSE "LeadRateLimit"."windowStartedAt"
      END,
      "updatedAt" = ${now}
    RETURNING "requestCount"
  `;
  const bucket = rows[0];

  if (!bucket) {
    throw new Error("The lead rate-limit bucket could not be created.");
  }

  if (bucket.requestCount === 1) {
    await prisma.leadRateLimit.deleteMany({
      where: { windowStartedAt: { lt: windowCutoff } },
    });
  }

  return {
    allowed: bucket.requestCount <= MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
  };
}
