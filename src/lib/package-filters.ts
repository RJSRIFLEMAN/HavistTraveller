export type PackageCategory = "EDUCATION" | "RECREATION" | "GRADUATION";

export interface PackageSummary {
  title: string;
  destination: string;
  category: PackageCategory;
  durationDays: number;
}

export interface PackageFilters {
  destination: string;
  category: string;
  durationDays: number | string;
  search: string;
}

export function filterPackages<T extends PackageSummary>(
  packages: readonly T[],
  filters: PackageFilters,
): T[] {
  const destination = filters.destination.trim().toLocaleLowerCase();
  const category = filters.category.trim().toLocaleUpperCase();
  const search = filters.search.trim().toLocaleLowerCase();
  const minimumDuration = filters.durationDays === "8+" ? 8 : undefined;
  const durationDays =
    filters.durationDays === "ALL" || minimumDuration !== undefined
      ? undefined
      : Number(filters.durationDays);

  return packages.filter((item) => {
    const matchesDestination =
      !destination ||
      destination === "all" ||
      item.destination.toLocaleLowerCase() === destination;
    const matchesCategory =
      !category || category === "ALL" || item.category === category;
    const matchesDuration =
      minimumDuration !== undefined
        ? item.durationDays >= minimumDuration
        : durationDays === undefined || item.durationDays === durationDays;
    const matchesSearch =
      !search ||
      item.title.toLocaleLowerCase().includes(search) ||
      item.destination.toLocaleLowerCase().includes(search);

    return matchesDestination && matchesCategory && matchesDuration && matchesSearch;
  });
}
