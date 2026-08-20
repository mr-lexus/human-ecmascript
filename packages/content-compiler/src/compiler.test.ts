import { describe, expect, it } from "vitest";
import { listArticleSlugs, loadArticle, validateContentPair } from "./index";

describe("content compiler", () => {
  it.each(["const-let-var", "reference-call-this", "values-types-memory"])(
    "loads the bilingual %s slice with matching semantic structure",
    (slug) => {
      const en = loadArticle("en", slug);
      const ru = loadArticle("ru", slug);
      expect(() => validateContentPair(en, ru)).not.toThrow();
    },
  );

  it("discovers every article deterministically", () => {
    expect(listArticleSlugs("en")).toEqual([
      "const-let-var",
      "reference-call-this",
      "values-types-memory",
    ]);
    expect(listArticleSlugs("ru")).toEqual(listArticleSlugs("en"));
  });

  it("loads executable sources for both slices", () => {
    const en = loadArticle("en", "reference-call-this");
    const declarations = loadArticle("en", "const-let-var");
    expect(en.exampleSources["method-call"]).toContain("obj.method");
    expect(declarations.exampleSources["declaration-tdz"]).toContain("let value");
  });

  it("loads the pinned TDZ bytecode artifact and its normalized guard", () => {
    const declarations = loadArticle("en", "const-let-var");
    const artifact = declarations.bytecodeArtifacts["const-let-var-tdz"];
    expect(artifact?.runtime.v8Version).toBe("13.6.233.17-node.50");
    expect(
      artifact?.cases
        .find(({ id }) => id === "let-across-branch")
        ?.instructions.map(({ opcode }) => opcode),
    ).toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "initialized-let")
        ?.instructions.map(({ opcode }) => opcode),
    ).not.toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "shadowed-let-before-declaration")
        ?.instructions.map(({ opcode }) => opcode),
    ).toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "initialized-shadowed-let")
        ?.instructions.map(({ opcode }) => opcode),
    ).not.toContain("ThrowReferenceErrorIfHole");
  });

  it("loads the pinned V8 value representations without confusing spec types and storage", () => {
    const values = loadArticle("en", "values-types-memory");
    const artifact = values.representationArtifacts["value-representations"];
    expect(artifact?.cases.find(({ id }) => id === "smi")).toMatchObject({
      specType: "Number",
      storage: "tagged-immediate",
      isSmi: true,
    });
    expect(artifact?.cases.find(({ id }) => id === "symbol")).toMatchObject({
      specType: "Symbol",
      storage: "heap-object",
      debugType: "Symbol",
    });
  });

  it("shows that binding location and value representation are separate V8 decisions", () => {
    const values = loadArticle("en", "values-types-memory");
    const artifact = values.bytecodeArtifacts["value-binding-storage"];
    expect(
      artifact?.cases
        .find(({ id }) => id === "local-smi")
        ?.instructions.map(({ opcode }) => opcode),
    ).toEqual(expect.arrayContaining(["LdaSmi", "Star0"]));
    expect(
      artifact?.cases
        .find(({ id }) => id === "captured-smi")
        ?.instructions.map(({ opcode }) => opcode),
    ).toEqual(expect.arrayContaining(["CreateFunctionContext", "StaCurrentContextSlot"]));
    expect(
      artifact?.cases
        .find(({ id }) => id === "captured-symbol")
        ?.instructions.map(({ opcode }) => opcode),
    ).toContain("StaCurrentContextSlot");
  });

  it("rejects a translation whose English source fingerprint is stale", () => {
    const en = loadArticle("en", "reference-call-this");
    const ru = loadArticle("ru", "reference-call-this");
    expect(() => validateContentPair(en, { ...ru, sourceContentHash: "0000000000000000" })).toThrow(
      "translation is stale",
    );
  });
});
