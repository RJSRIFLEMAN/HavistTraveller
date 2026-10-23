import assert from "node:assert/strict";
import test from "node:test";
import { filterPackages, type PackageSummary } from "../src/lib/package-filters.ts";

const packages: PackageSummary[] = [
  {
    title: "Bali School Discovery",
    destination: "Bali",
    category: "EDUCATION",
    durationDays: 3,
  },
  {
    title: "Yogyakarta Heritage Weekend",
    destination: "Yogyakarta",
    category: "RECREATION",
    durationDays: 2,
  },
  {
    title: "Bali Graduation Celebration",
    destination: "Bali",
    category: "GRADUATION",
    durationDays: 3,
  },
  {
    title: "Java Long Discovery",
    destination: "Java",
    category: "EDUCATION",
    durationDays: 8,
  },
  {
    title: "Sumatra Explorer",
    destination: "Sumatra",
    category: "RECREATION",
    durationDays: 12,
  },
];

test("filters packages by destination, category, and duration together", () => {
  assert.deepEqual(
    filterPackages(packages, {
      destination: "Bali",
      category: "EDUCATION",
      durationDays: 3,
      search: "",
    }).map((item) => item.title),
    ["Bali School Discovery"],
  );
});

test("matches destination and title case-insensitively", () => {
  assert.equal(
    filterPackages(packages, {
      destination: "yOgYaKaRtA",
      category: "ALL",
      durationDays: "ALL",
      search: "HERITAGE",
    }).length,
    1,
  );
});

test("returns every item when all filters are empty", () => {
  assert.equal(
    filterPackages(packages, {
      destination: "ALL",
      category: "ALL",
      durationDays: "ALL",
      search: " ",
    }).length,
    5,
  );
});

test("filters 8+ days inclusively", () => {
  assert.deepEqual(
    filterPackages(packages, {
      destination: "ALL",
      category: "ALL",
      durationDays: "8+",
      search: "",
    }).map((item) => item.durationDays),
    [8, 12],
  );
});
