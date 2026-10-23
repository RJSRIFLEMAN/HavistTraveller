import assert from "node:assert/strict";
import test from "node:test";
import {
  fleetSchema,
  travelPackageSchema,
} from "../src/lib/travel-content-schema.ts";

const travelPackage = {
  _id: "package-1",
  title: "Yogyakarta Discovery",
  slug: "yogyakarta-discovery",
  destination: "Yogyakarta",
  category: "EDUCATION",
  excerpt: "An educational city break.",
  coverImage: {
    url: "https://cdn.sanity.io/images/project/production/cover.jpg",
    alt: "A sunrise over a temple.",
  },
  startPrice: 1500000,
  durationDays: 3,
  itinerary: [{ day: 1, title: "Arrival", activities: ["Hotel check-in"] }],
  facilities: ["Tour leader"],
};

test("validates CMS travel package content before it reaches the UI", () => {
  assert.equal(travelPackageSchema.parse(travelPackage).title, "Yogyakarta Discovery");
  assert.equal(
    travelPackageSchema.safeParse({
      ...travelPackage,
      category: "UNLISTED",
    }).success,
    false,
  );
});

test("rejects fleet content without a valid image or capacity", () => {
  assert.equal(
    fleetSchema.safeParse({
      _id: "bus-1",
      name: "Jetbus 5",
      slug: "jetbus-5",
      model: "Jetbus 5 Adiputro",
      capacity: 40,
      coverImage: { url: "not-a-url", alt: "Tour bus" },
      facilities: ["Wi-Fi"],
    }).success,
    false,
  );
});
