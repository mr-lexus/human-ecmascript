import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findWorkspaceRoot, listArticleSlugs } from "@human-ecmascript/content-compiler";
import sitemap from "../app/sitemap";
import { featuredTopics, topicSequence } from "./featuredTopics";

describe("release topic inventory", () => {
  it("covers both content inventories exactly once and has a route for every topic", () => {
    const slugs = featuredTopics.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const locale of ["en", "ru"] as const) {
      expect([...slugs].sort()).toEqual(listArticleSlugs(locale));
      for (const topic of featuredTopics) {
        expect(topic.copy[locale].title.trim()).not.toBe("");
        expect(topic.copy[locale].body.trim()).not.toBe("");
        expect(topic.copy[locale].searchTerms.trim()).not.toBe("");
      }
    }
    for (const slug of slugs) {
      expect(
        existsSync(join(findWorkspaceRoot(), "apps/web/app/[lang]/guide", slug, "page.tsx")),
      ).toBe(true);
    }
    expect(() => topicSequence("unlisted-topic")).toThrow("missing from the release inventory");
  });

  it("exports exactly one sitemap guide URL per locale and topic", () => {
    const urls = sitemap()
      .filter(({ url }) => url.includes("/guide/"))
      .map(({ url }) => url);
    expect(urls).toEqual(
      ["en", "ru"].flatMap((locale) =>
        featuredTopics.map(
          ({ slug }) => `https://mr-lexus.github.io/human-ecmascript/${locale}/guide/${slug}/`,
        ),
      ),
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(topicSequence("typeof-not-type-query")).toBe(4);
  });
});
