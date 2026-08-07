import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://human-ecmascript.github.io/human-ecmascript";
  return ["en", "ru"].flatMap((locale) => [
    { url: `${base}/${locale}/`, changeFrequency: "monthly" as const, priority: 1 },
    {
      url: `${base}/${locale}/guide/reference-call-this/`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    { url: `${base}/${locale}/spec/`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/${locale}/glossary/`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);
}
