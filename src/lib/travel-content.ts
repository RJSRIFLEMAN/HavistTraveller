import { getSanityClient } from "@/lib/sanity";
import type { PackageSearchParams } from "@/lib/package-query";
import {
  fleetItemsSchema,
  travelPackageSchema,
  travelPackagesSchema,
  type FleetItem,
  type TravelPackage,
} from "@/lib/travel-content-schema";

export type { FleetItem, TravelPackage } from "@/lib/travel-content-schema";

const PACKAGE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  destination,
  category,
  excerpt,
  "coverImage": {
    "url": coverImage.asset->url,
    "alt": coalesce(coverImage.alt, title)
  },
  startPrice,
  originalPrice,
  durationDays,
  "itinerary": itinerary[]{day, title, activities},
  facilities
}`;

export async function getTravelPackages(
  filters: PackageSearchParams,
): Promise<TravelPackage[]> {
  const client = getSanityClient();
  const query = `*[
    _type == "travelPackage" &&
    isActive == true &&
    ($destination == "ALL" || lower(destination) == lower($destination)) &&
    ($category == "ALL" || category == $category) &&
    (
      $durationDays == "ALL" ||
      ($durationDays == "8+" && durationDays >= 8) ||
      ($durationDays != "8+" && durationDays == $durationDays)
    ) &&
    ($search == "" || title match $search || destination match $search)
  ] | order(sortOrder asc, _updatedAt desc) ${PACKAGE_PROJECTION}`;

  const result: unknown = await client.fetch(query, {
    destination: filters.destination,
    category: filters.category,
    durationDays: filters.durationDays,
    search: filters.search ? `*${filters.search}*` : "",
  });
  return travelPackagesSchema.parse(result);
}

export async function getTravelPackageBySlug(slug: string): Promise<TravelPackage | null> {
  const client = getSanityClient();
  const query = `*[_type == "travelPackage" && isActive == true && slug.current == $slug][0] ${PACKAGE_PROJECTION}`;

  const result: unknown = await client.fetch(query, { slug });
  return result === null ? null : travelPackageSchema.parse(result);
}

export async function getFleet(): Promise<FleetItem[]> {
  const client = getSanityClient();
  const query = `*[
    _type == "fleet" &&
    isActive == true
  ] | order(sortOrder asc, _updatedAt desc) {
    _id,
    "name": name,
    "slug": slug.current,
    model,
    capacity,
    "coverImage": {
      "url": coverImage.asset->url,
      "alt": coalesce(coverImage.alt, name)
    },
    facilities
  }`;

  const result: unknown = await client.fetch(query);
  return fleetItemsSchema.parse(result);
}
