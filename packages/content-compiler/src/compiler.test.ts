import { describe, expect, it } from "vitest";
import { loadArticle, validateContentPair } from "./index";

describe("content compiler", () => {
  it("loads the bilingual vertical slice with matching semantic structure", () => {
    const en = loadArticle("en", "reference-call-this");
    const ru = loadArticle("ru", "reference-call-this");
    expect(() => validateContentPair(en, ru)).not.toThrow();
    expect(en.exampleSources["method-call"]).toContain("obj.method");
  });

  it("rejects a translation whose English source fingerprint is stale", () => {
    const en = loadArticle("en", "reference-call-this");
    const ru = loadArticle("ru", "reference-call-this");
    expect(() => validateContentPair(en, { ...ru, sourceContentHash: "0000000000000000" })).toThrow(
      "translation is stale",
    );
  });
});
