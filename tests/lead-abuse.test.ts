import assert from "node:assert/strict";
import test from "node:test";
import {
  createLeadRateLimitKey,
  getTrustedClientAddress,
} from "../src/lib/lead-abuse-identity.ts";

test("uses a trusted reverse-proxy client IP header", () => {
  assert.equal(
    getTrustedClientAddress(
      new Headers({
        "x-real-ip": "203.0.113.8",
        "x-forwarded-for": "198.51.100.4, 203.0.113.8",
      }),
    ),
    "203.0.113.8",
  );
});

test("does not accept an untrusted forwarded address in production", () => {
  assert.equal(
    getTrustedClientAddress(new Headers({ "x-forwarded-for": "198.51.100.4" }), "production"),
    null,
  );
});

test("keys are stable for the same IP and secret without storing the IP", () => {
  const key = createLeadRateLimitKey("203.0.113.8", "a-secret");
  assert.equal(createLeadRateLimitKey("203.0.113.8", "a-secret"), key);
  assert.notEqual(createLeadRateLimitKey("203.0.113.8", "other-secret"), key);
  assert.equal(key.includes("203.0.113.8"), false);
});
