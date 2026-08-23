import { describe, expect, it } from "vitest";
import { articleSchema } from "./index";

describe("article publication rules", () => {
  it("rejects an uncertain claim in a READY article", () => {
    const result = articleSchema.safeParse({
      id: "topic",
      slug: "topic",
      locale: "en",
      sourceContentHash: "12345678",
      title: "Topic",
      eyebrow: "Guide",
      dek: "Description",
      status: "READY",
      sourceSnapshot: "ES2026",
      readingMinutes: 1,
      learningObjectives: ["Learn"],
      prerequisites: [],
      citations: [
        {
          id: "c1",
          snapshot: "ES2026",
          nodeId: "n1",
          label: "Clause",
          url: "https://example.com/#n1",
          relevance: "Evidence",
          evidenceHash: "12345678",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Section",
          mode: "human",
          blocks: [
            {
              id: "b1",
              type: "claims",
              claims: [
                {
                  id: "claim-1",
                  classification: "UNCERTAIN",
                  text: "Maybe",
                  citationIds: ["c1"],
                  sourceFingerprint: "12345678",
                  confidence: 0.2,
                  reviewStatus: "DRAFT",
                },
              ],
            },
          ],
        },
      ],
      examples: [
        {
          id: "example",
          title: "Example",
          goal: "Show behavior",
          sourcePath: "examples/example.js",
          timeoutMs: 500,
          expectedOutput: [],
          claimIds: ["claim-1"],
          citationIds: ["c1"],
        },
      ],
      engineResults: [],
      graph: { nodes: [], edges: [] },
    });

    expect(result.success).toBe(false);
  });

  const articleFixture = (
    articleStatus: "READY" | "TECH_REVIEW",
    claimReviewStatus: "READY" | "TECH_REVIEW" | "STALE",
  ) => ({
    id: "topic",
    slug: "topic",
    locale: "en" as const,
    sourceContentHash: "12345678",
    title: "Topic",
    eyebrow: "Guide",
    dek: "Description",
    status: articleStatus,
    sourceSnapshot: "ES2026",
    readingMinutes: 1,
    learningObjectives: ["Learn"],
    prerequisites: [],
    citations: [
      {
        id: "c1",
        snapshot: "ES2026",
        nodeId: "n1",
        label: "Clause",
        url: "https://example.com/#n1",
        relevance: "Evidence",
        evidenceHash: "12345678",
      },
    ],
    sections: [
      {
        id: "s1",
        title: "Section",
        mode: "human" as const,
        blocks: [
          {
            id: "b1",
            type: "claims" as const,
            claims: [
              {
                id: "claim-1",
                classification: "NORMATIVE" as const,
                text: "A claim",
                citationIds: ["c1"],
                sourceFingerprint: "12345678",
                confidence: 1,
                reviewStatus: claimReviewStatus,
              },
            ],
          },
        ],
      },
    ],
    examples: [
      {
        id: "example",
        title: "Example",
        goal: "Show behavior",
        sourcePath: "examples/example.js",
        timeoutMs: 500,
        expectedOutput: [],
        claimIds: ["claim-1"],
        citationIds: ["c1"],
      },
    ],
    engineResults: [],
    graph: { nodes: [], edges: [] },
  });

  it("rejects a TECH_REVIEW claim in a READY article", () => {
    expect(articleSchema.safeParse(articleFixture("READY", "TECH_REVIEW")).success).toBe(false);
  });

  it("accepts an article whose READY claims are all READY", () => {
    expect(articleSchema.safeParse(articleFixture("READY", "READY")).success).toBe(true);
  });

  it("leaves non-READY article claim states unconstrained", () => {
    expect(articleSchema.safeParse(articleFixture("TECH_REVIEW", "TECH_REVIEW")).success).toBe(
      true,
    );
  });

  it("rejects a STALE claim in a READY article", () => {
    expect(articleSchema.safeParse(articleFixture("READY", "STALE")).success).toBe(false);
  });
});
