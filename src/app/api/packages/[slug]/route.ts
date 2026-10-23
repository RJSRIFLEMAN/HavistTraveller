import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSanityConfigured } from "@/lib/sanity";
import { getTravelPackageBySlug } from "@/lib/travel-content";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!slugSchema.safeParse(slug).success) {
    return NextResponse.json(
      { error: { code: "INVALID_PACKAGE_SLUG", message: "Paket wisata tidak ditemukan." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isSanityConfigured()) {
    return NextResponse.json(
      { error: { code: "CMS_NOT_CONFIGURED", message: "Katalog paket belum tersedia." } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const travelPackage = await getTravelPackageBySlug(slug);
    if (!travelPackage) {
      return NextResponse.json(
        { error: { code: "PACKAGE_NOT_FOUND", message: "Paket wisata tidak ditemukan." } },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { data: travelPackage },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("[api/packages/:slug] Sanity query failed.");
    return NextResponse.json(
      { error: { code: "CMS_UNAVAILABLE", message: "Detail paket sedang tidak dapat diakses." } },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
