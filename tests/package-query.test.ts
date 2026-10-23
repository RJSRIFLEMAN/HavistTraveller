import assert from "node:assert/strict";
import test from "node:test";
import { parsePackageSearchParams } from "../src/lib/package-query.ts";

test("normalizes a valid CMS package search query", () => {
  assert.deepEqual(
    parsePackageSearchParams(
      new URLSearchParams({
        destination: " Bali ",
        category: "education",
        durationDays: "3",
        search: "  school ",
      }),
    ),
    {
      destination: "Bali",
      category: "EDUCATION",
      durationDays: 3,
      search: "school",
    },
  );
});

test("uses broad defaults when optional package filters are omitted", () => {
  assert.deepEqual(parsePackageSearchParams(new URLSearchParams()), {
    destination: "ALL",
    category: "ALL",
    durationDays: "ALL",
    search: "",
  });
});

test("preserves the inclusive 8+ day duration filter", () => {
  assert.deepEqual(
    parsePackageSearchParams(new URLSearchParams({ durationDays: "8+" })),
    {
      destination: "ALL",
      category: "ALL",
      durationDays: "8+",
      search: "",
    },
  );
});

test("rejects invalid filters and overlong search input", () => {
  assert.throws(
    () => parsePackageSearchParams(new URLSearchParams({ durationDays: "0" })),
  );
  assert.throws(
    () => parsePackageSearchParams(new URLSearchParams({ search: "x".repeat(101) })),
  );
});
