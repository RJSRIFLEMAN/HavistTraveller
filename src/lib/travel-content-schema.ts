import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().min(1).max(160),
});

const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().trim().min(1).max(100),
  activities: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
});

export const travelPackageSchema = z.object({
  _id: z.string().min(1).max(128),
  title: z.string().trim().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  destination: z.string().trim().min(1).max(80),
  category: z.enum(["EDUCATION", "RECREATION", "GRADUATION"]),
  excerpt: z.string().trim().min(1).max(220),
  coverImage: imageSchema,
  startPrice: z.number().int().positive(),
  originalPrice: z.number().int().positive().optional(),
  durationDays: z.number().int().min(1).max(60),
  itinerary: z.array(itineraryDaySchema).min(1).max(60),
  facilities: z.array(z.string().trim().min(1).max(120)).min(1).max(50),
});

export const fleetSchema = z.object({
  _id: z.string().min(1).max(128),
  name: z.string().trim().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  model: z.string().trim().min(1).max(100),
  capacity: z.number().int().min(1).max(100),
  coverImage: imageSchema,
  facilities: z.array(z.string().trim().min(1).max(120)).min(1).max(50),
});

export const travelPackagesSchema = z.array(travelPackageSchema);
export const fleetItemsSchema = z.array(fleetSchema);

export type TravelPackage = z.infer<typeof travelPackageSchema>;
export type FleetItem = z.infer<typeof fleetSchema>;
