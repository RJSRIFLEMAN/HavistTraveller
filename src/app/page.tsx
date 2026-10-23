import { HomeClient } from "@/components/HomeClient";
import { isSanityConfigured } from "@/lib/sanity";
import { getFleet, getTravelPackages } from "@/lib/travel-content";
import type { PackageSearchParams } from "@/lib/package-query";
import type { FleetItem, TravelPackage } from "@/lib/travel-content";

export const dynamic = "force-dynamic";

const emptyFilters: PackageSearchParams = {
  destination: "ALL",
  category: "ALL",
  durationDays: "ALL",
  search: "",
};

export default async function HomePage() {
  const cmsConfigured = isSanityConfigured();
  let contentStatus: "ready" | "not-configured" | "unavailable" = cmsConfigured
    ? "ready"
    : "not-configured";
  let packages: TravelPackage[] = [];
  let fleet: FleetItem[] = [];

  if (cmsConfigured) {
    try {
      [packages, fleet] = await Promise.all([
        getTravelPackages(emptyFilters),
        getFleet(),
      ]);
    } catch {
      console.error("[home] Sanity content query failed.");
      contentStatus = "unavailable";
    }
  }

  return (
    <HomeClient
      initialPackages={packages}
      initialFleet={fleet}
      cmsConfigured={cmsConfigured}
      contentStatus={contentStatus}
      proposalUrl={process.env.NEXT_PUBLIC_PROPOSAL_URL ?? "/proposal-havist-2025.pdf"}
    />
  );
}
