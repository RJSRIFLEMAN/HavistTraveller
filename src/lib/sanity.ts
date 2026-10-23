import { createClient } from "@sanity/client";

export function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim();

  return Boolean(
    projectId &&
      !projectId.includes("replace-with") &&
      dataset &&
      !dataset.includes("replace-with") &&
      apiVersion,
  );
}

export function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

  if (!isSanityConfigured() || !projectId || !dataset || !apiVersion) {
    throw new Error("Sanity is not configured. Set the required SANITY environment variables.");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
    perspective: "published",
  });
}
