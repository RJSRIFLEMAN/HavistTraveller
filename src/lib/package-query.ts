import { z } from "zod";

const categorySchema = z.enum(["ALL", "EDUCATION", "RECREATION", "GRADUATION"]);

const packageSearchSchema = z.object({
  destination: z.string().trim().min(1).max(80).default("ALL"),
  category: z
    .string()
    .trim()
    .toUpperCase()
    .pipe(categorySchema)
    .default("ALL"),
  durationDays: z
    .union([
      z.literal("ALL"),
      z.literal("8+"),
      z.coerce.number().int().min(1).max(60),
    ])
    .default("ALL"),
  search: z.string().trim().max(100).default(""),
});

export type PackageSearchParams = z.infer<typeof packageSearchSchema>;

export function parsePackageSearchParams(params: URLSearchParams): PackageSearchParams {
  const duration = params.get("durationDays")?.trim().toUpperCase() || "ALL";

  return packageSearchSchema.parse({
    destination: params.get("destination")?.trim() || "ALL",
    category: params.get("category")?.trim() || "ALL",
    durationDays: duration,
    search: params.get("search") ?? "",
  });
}
