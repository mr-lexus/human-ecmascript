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
});
