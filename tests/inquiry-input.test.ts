import assert from "node:assert/strict";
import test from "node:test";
import { inquiryInputSchema } from "../src/lib/inquiry-input.ts";

test("normalizes inquiry contact data and trims the message", () => {
  assert.deepEqual(
    inquiryInputSchema.parse({
      email: "  ORGANIZER@example.com ",
      message: "  Kami ingin merencanakan perjalanan sekolah.  ",
      type: "EDUCATION",
      consent: true,
      website: "",
    }),
    {
      email: "organizer@example.com",
      message: "Kami ingin merencanakan perjalanan sekolah.",
      type: "EDUCATION",
      consent: true,
      website: "",
    },
  );
});

test("requires consent and bounded, non-empty inquiry messages", () => {
  assert.equal(
    inquiryInputSchema.safeParse({
      email: "organizer@example.com",
      message: "Perjalanan",
      type: "CORPORATE",
      consent: false,
    }).success,
    false,
  );
  assert.equal(
    inquiryInputSchema.safeParse({
      email: "organizer@example.com",
      message: " ".repeat(2001),
      type: "CORPORATE",
      consent: true,
    }).success,
    false,
  );
});
