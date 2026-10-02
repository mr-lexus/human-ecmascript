import { describe, expect, it } from "vitest";
import { computeSiteStats, listArticleSlugs, loadArticle, validateContentPair } from "./index";

describe("content compiler", () => {
  it.each(listArticleSlugs("en"))(
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
      "typeof-not-type-query",
      "values-types-memory",
    ]);
    expect(listArticleSlugs("ru")).toEqual(listArticleSlugs("en"));
  });

  it("derives the verification snapshot from real bilingual content", () => {
    expect(computeSiteStats()).toEqual({
      bilingualTopics: 4,
      claims: 69,
      citations: 80,
      examples: 33,
      verifiedV8Baselines: 27,
      pendingEngineBaselines: 2,
      bytecodeArtifacts: 3,
      representationArtifacts: 1,
      snapshot: "ECMA-262-ES2026",
    });
  });

  it("loads executable sources for the existing slices", () => {
    const en = loadArticle("en", "reference-call-this");
    const declarations = loadArticle("en", "const-let-var");
    expect(en.exampleSources["method-call"]).toContain("obj.method");
    expect(declarations.exampleSources["declaration-tdz"]).toContain("let value");
  });

  it("keeps typeof evidence, traces, examples, and review states aligned in both locales", () => {
    const en = loadArticle("en", "typeof-not-type-query");
    const ru = loadArticle("ru", "typeof-not-type-query");
    expect(en.status).toBe("TECH_REVIEW");
    expect(ru.status).toBe("LOCALE_REVIEW");
    const evidenceShape = (article: typeof en) => ({
      claims: article.sections
        .flatMap(({ blocks }) => blocks)
        .flatMap((block) =>
          block.type === "claims" ? block.claims.map(({ text: _text, ...claim }) => claim) : [],
        ),
      citations: article.citations.map(
        ({ label: _label, relevance: _relevance, ...citation }) => citation,
      ),
      sections: article.sections.map(({ id, mode, exampleIds }) => ({ id, mode, exampleIds })),
      examples: article.examples.map(({ title: _title, goal: _goal, ...example }) => example),
      graph: article.graph,
    });
    expect(evidenceShape(ru)).toEqual(evidenceShape(en));
    expect(evidenceShape(en).claims).toHaveLength(16);
    expect(
      evidenceShape(en).claims.every(({ reviewStatus }) => reviewStatus === "TECH_REVIEW"),
    ).toBe(true);
    expect(en.examples.map(({ id }) => id)).toEqual([
      "typeof-primitive-results",
      "typeof-object-collapse",
      "typeof-name-resolution",
      "typeof-evaluation-effects",
      "typeof-call-construct",
      "typeof-proxy-boundary",
    ]);
    const traces = en.sections
      .flatMap(({ blocks }) => blocks)
      .filter((block) => block.type === "trace");
    expect(traces.map(({ id }) => id)).toEqual([
      "trace-typeof-missing-name",
      "trace-typeof-tdz",
      "trace-typeof-callable-object",
    ]);
    expect(
      traces.find(({ id }) => id === "trace-typeof-tdz")?.steps.map(({ operation }) => operation),
    ).toEqual([
      "BlockDeclarationInstantiation",
      "ResolveBinding → GetIdentifierReference",
      "typeof → GetValue",
      "GetBindingValue",
    ]);
    expect(en.sections.find(({ id }) => id === "typeof-references")?.exampleIds).toContain(
      "typeof-name-resolution",
    );
    expect(en.sections.find(({ id }) => id === "typeof-capabilities")?.exampleIds).toEqual([
      "typeof-call-construct",
      "typeof-proxy-boundary",
    ]);
    expect(en.sections.find(({ id }) => id === "typeof-host-boundary")?.exampleIds).toEqual([]);
    expect(en.engineResults).toEqual([]);
    expect(en.bytecodeArtifacts).toEqual({});
    expect(en.representationArtifacts).toEqual({});
    expect(en.examples.find(({ id }) => id === "typeof-call-construct")?.expectedOutput).toContain(
      "explicit-class-call:TypeError",
    );
  });

  it("keeps the new-and-this section reachable and links focused examples", () => {
    const article = loadArticle("ru", "reference-call-this");
    const tabLabels = article.sections.map((section) => section.tabLabel ?? section.mode);
    const construction = article.sections.find(({ id }) => id === "construction-call");

    expect(new Set(tabLabels).size).toBe(tabLabels.length);
    expect(construction?.tabLabel).toBe("`new` и `this`");
    expect(construction?.exampleIds).toEqual([
      "new-this-binding",
      "new-return-object",
      "new-return-primitive",
      "new-proxy-result",
      "new-arrow",
    ]);
    expect(article.exampleSources["new-this-binding"]).toContain(
      "observation.receivedThis === person",
    );
    expect(article.exampleSources["new-return-object"]).toContain(
      "result !== observation.candidateThis",
    );
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
    expect(
      artifact?.cases
        .find(({ id }) => id === "nested-without-shadowing")
        ?.instructions.map(({ opcode }) => opcode),
    ).not.toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "shadowed-const-before-declaration")
        ?.instructions.map(({ opcode }) => opcode),
    ).toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "initialized-shadowed-const")
        ?.instructions.map(({ opcode }) => opcode),
    ).not.toContain("ThrowReferenceErrorIfHole");
    expect(
      artifact?.cases
        .find(({ id }) => id === "intentional-function-var")
        ?.instructions.map(({ opcode }) => opcode),
    ).not.toContain("ThrowReferenceErrorIfHole");
    const functionVarOpcodes = artifact?.cases
      .find(({ id }) => id === "intentional-function-var")
      ?.instructions.map(({ opcode }) => opcode);
    const functionLetOpcodes = artifact?.cases
      .find(({ id }) => id === "intentional-function-let")
      ?.instructions.map(({ opcode }) => opcode);
    expect(functionLetOpcodes).not.toContain("ThrowReferenceErrorIfHole");
    expect(functionVarOpcodes).not.toContain("LdaUndefined");
    expect(functionLetOpcodes?.slice(0, 2)).toEqual(["LdaUndefined", "Star0"]);
  });

  it("separates syntactic nesting from captured and per-iteration context costs", () => {
    const declarations = loadArticle("en", "const-let-var");
    const artifact = declarations.bytecodeArtifacts["const-let-var-nesting"];
    const opcodes = (id: string) =>
      artifact?.cases.find((item) => item.id === id)?.instructions.map(({ opcode }) => opcode);

    expect(opcodes("nested-let-read")).toEqual(opcodes("nested-var-read"));
    expect(opcodes("make-captured-let")).toContain("CreateFunctionContext");
    expect(opcodes("make-captured-var")).toContain("CreateFunctionContext");
    expect(opcodes("read-captured-let")).toContain("LdaImmutableCurrentContextSlot");
    expect(opcodes("read-captured-var")).toContain("LdaImmutableCurrentContextSlot");
    expect(opcodes("captured-loop-let")).toContain("CreateBlockContext");
    expect(opcodes("captured-loop-var")).not.toContain("CreateBlockContext");
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
