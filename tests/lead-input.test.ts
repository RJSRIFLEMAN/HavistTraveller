import assert from "node:assert/strict";
import test from "node:test";
import { leadInputSchema } from "../src/lib/lead-input.ts";

test("normalizes a valid email and requires proposal consent", () => {
  assert.deepEqual(
    leadInputSchema.parse({
      email: "  TRAVELLER@example.com ",
      consent: true,
      website: "",
    }),
    {
      email: "traveller@example.com",
      consent: true,
      website: "",
    },
  );
});

test("rejects malformed emails and missing consent", () => {
  assert.equal(leadInputSchema.safeParse({ email: "nope", consent: true }).success, false);
  assert.equal(leadInputSchema.safeParse({ email: "traveller@example.com", consent: false }).success, false);
});
