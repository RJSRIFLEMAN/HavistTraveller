import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { parsePackageSearchParams } from "@/lib/package-query";
import { isSanityConfigured } from "@/lib/sanity";
import { getTravelPackages } from "@/lib/travel-content";

export async function GET(request: NextRequest) {
  let filters;
  try {
    filters = parsePackageSearchParams(request.nextUrl.searchParams);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PACKAGE_FILTERS",
            message: "Periksa kembali filter pencarian paket.",
            details: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    throw error;
  }

  if (!isSanityConfigured()) {
    return NextResponse.json(
      {
        error: {
          code: "CMS_NOT_CONFIGURED",
          message: "Katalog paket belum tersedia. Silakan hubungi tim Havist Traveller.",
        },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const packages = await getTravelPackages(filters);
    return NextResponse.json(
      { data: packages },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("[api/packages] Sanity query failed.");
    return NextResponse.json(
      {
        error: {
          code: "CMS_UNAVAILABLE",
          message: "Katalog paket sedang tidak dapat diakses. Silakan coba lagi.",
        },
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
