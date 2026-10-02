import type { MetadataRoute } from "next";
import { featuredTopics } from "../lib/featuredTopics";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mr-lexus.github.io/human-ecmascript";
  return ["en", "ru"].flatMap((locale) => [
    { url: `${base}/${locale}/`, changeFrequency: "monthly" as const, priority: 1 },
    ...featuredTopics.map((topic, index) => ({
      url: `${base}/${locale}/guide/${topic.slug}/`,
      changeFrequency: "monthly" as const,
      priority: index === 0 ? 0.9 : 0.85,
    })),
    { url: `${base}/${locale}/spec/`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/${locale}/glossary/`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);
}
