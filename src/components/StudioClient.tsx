"use client";

import dynamic from "next/dynamic";
import config from "../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((studio) => studio.NextStudio),
  { ssr: false },
);

export function StudioClient() {
  return <NextStudio config={config} />;
}
