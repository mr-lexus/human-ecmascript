import { z } from "zod";

export const locales = ["en", "ru"] as const;
export const localeSchema = z.enum(locales);
export type Locale = z.infer<typeof localeSchema>;

export const claimClassificationSchema = z.enum([
  "NORMATIVE",
  "DERIVED",
  "OBSERVABLE",
  "HOST_DEFINED",
  "IMPLEMENTATION_DEFINED",
  "V8_IMPLEMENTATION",
  "INFORMATIVE",
  "UNCERTAIN",
]);
export type ClaimClassification = z.infer<typeof claimClassificationSchema>;

export const reviewStatusSchema = z.enum([
  "DRAFT",
  "TECH_REVIEW",
  "VERIFIED_EN",
  "TRANSLATED_RU",
  "LOCALE_REVIEW",
  "READY",
  "STALE",
  "BLOCKED",
]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const citationSchema = z.object({
  id: z.string().min(1),
  snapshot: z.string().min(1),
  nodeId: z.string().min(1),
  stepId: z.string().optional(),
  label: z.string().min(1),
  url: z.string().url(),
  relevance: z.string().min(1),
  evidenceHash: z.string().min(8),
});
export type Citation = z.infer<typeof citationSchema>;

export const claimSchema = z.object({
  id: z.string().min(1),
  classification: claimClassificationSchema,
  text: z.string().min(1),
  citationIds: z.array(z.string().min(1)).min(1),
  sourceFingerprint: z.string().min(8),
  confidence: z.number().min(0).max(1),
  reviewStatus: reviewStatusSchema,
});
export type Claim = z.infer<typeof claimSchema>;

export const traceStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  operation: z.string().min(1),
  detail: z.string().min(1),
  citationId: z.string().optional(),
});

export const operationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["record", "abstract-operation", "internal-method", "runtime-semantics"]),
  summary: z.string().min(1),
  citationId: z.string(),
});

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ id: z.string(), type: z.literal("prose"), body: z.string().min(1) }),
  z.object({ id: z.string(), type: z.literal("claims"), claims: z.array(claimSchema).min(1) }),
  z.object({ id: z.string(), type: z.literal("trace"), steps: z.array(traceStepSchema).min(1) }),
  z.object({
    id: z.string(),
    type: z.literal("operations"),
    operations: z.array(operationSchema).min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal("note"),
    tone: z.enum(["insight", "warning", "implementation"]),
    title: z.string(),
    body: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("bytecode"),
    artifactId: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    body: z.string().min(1),
    cases: z
      .array(
        z.object({
          id: z.string().min(1),
          caseId: z.string().min(1),
          title: z.string().min(1),
          explanation: z.string().min(1),
        }),
      )
      .min(1),
  }),
  z.object({
    id: z.string(),
    type: z.literal("representation"),
    artifactId: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    body: z.string().min(1),
    cases: z
      .array(
        z.object({
          id: z.string().min(1),
          caseId: z.string().min(1),
          title: z.string().min(1),
          explanation: z.string().min(1),
        }),
      )
      .min(1),
  }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const articleSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  mode: z.enum(["human", "normative", "observable", "v8"]),
  blocks: z.array(contentBlockSchema).min(1),
});
export type ArticleSection = z.infer<typeof articleSectionSchema>;

export const exampleManifestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  goal: z.string().min(1),
  sourcePath: z.string().regex(/^examples\/[a-z0-9-]+\.(m?js)$/),
  timeoutMs: z.number().int().min(100).max(5_000),
  expectedOutput: z.array(z.string()),
  claimIds: z.array(z.string()).min(1),
  citationIds: z.array(z.string()).min(1),
});
export type ExampleManifest = z.infer<typeof exampleManifestSchema>;

export const engineResultSchema = z.object({
  exampleId: z.string(),
  engine: z.enum(["V8", "SpiderMonkey", "JavaScriptCore", "QuickJS"]),
  version: z.string(),
  binaryHash: z.string().min(8),
  status: z.enum(["verified", "documented-baseline", "pending"]),
  output: z.array(z.string()),
  capturedAt: z.string(),
  note: z.string().optional(),
});
export type EngineResult = z.infer<typeof engineResultSchema>;

export const v8BytecodeInstructionSchema = z.object({
  offset: z.number().int().nonnegative(),
  bytes: z.string().regex(/^[0-9a-f]{2}( [0-9a-f]{2})*$/),
  opcode: z.string().min(1),
  operands: z.string(),
});

export const v8BytecodeCaseSchema = z.object({
  id: z.string().min(1),
  functionName: z.string().min(1),
  source: z.string().min(1),
  bytecodeLength: z.number().int().positive(),
  parameterCount: z.number().int().nonnegative(),
  registerCount: z.number().int().nonnegative(),
  frameSize: z.number().int().nonnegative(),
  instructions: z.array(v8BytecodeInstructionSchema).min(1),
});

export const v8BytecodeArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  provider: z.literal("V8 Ignition"),
  sourcePath: z.string().regex(/^examples\/[a-z0-9-]+\.(m?js)$/),
  sourceSha256: z.string().regex(/^[0-9a-f]{64}$/),
  runtime: z.object({
    name: z.literal("Node.js"),
    version: z.string().min(1),
    v8Version: z.string().min(1),
    platform: z.string().min(1),
    binarySha256: z.string().regex(/^[0-9a-f]{64}$/),
  }),
  commandTemplate: z.string().min(1),
  capturedAt: z.string().date(),
  cases: z.array(v8BytecodeCaseSchema).min(1),
  captureSha256: z.string().regex(/^[0-9a-f]{64}$/),
});
export type V8BytecodeArtifact = z.infer<typeof v8BytecodeArtifactSchema>;

export const v8ValueRepresentationCaseSchema = z.object({
  id: z.string().min(1),
  expression: z.string().min(1),
  specType: z.enum(["Number", "String", "Symbol", "BigInt"]),
  isSmi: z.boolean(),
  storage: z.enum(["tagged-immediate", "heap-object"]),
  debugType: z.string().min(1),
  debugSummary: z.array(z.string().min(1)).min(1),
});

export const v8ValueRepresentationArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  provider: z.literal("V8 tagged values"),
  runtime: z.object({
    name: z.literal("Node.js"),
    version: z.string().min(1),
    v8Version: z.string().min(1),
    platform: z.string().min(1),
    binarySha256: z.string().regex(/^[0-9a-f]{64}$/),
  }),
  commandTemplate: z.string().min(1),
  capturedAt: z.string().date(),
  cases: z.array(v8ValueRepresentationCaseSchema).min(1),
  captureSha256: z.string().regex(/^[0-9a-f]{64}$/),
});
export type V8ValueRepresentationArtifact = z.infer<typeof v8ValueRepresentationArtifactSchema>;

export const graphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum([
    "syntax",
    "record",
    "operation",
    "internal-method",
    "call",
    "type",
    "representation",
  ]),
  citationId: z.string().optional(),
});
export const graphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  kind: z.enum([
    "produces",
    "calls",
    "uses",
    "supplies-receiver",
    "binds",
    "classifies",
    "implements",
    "not-equivalent",
  ]),
  weight: z.number().positive().default(1),
});
export type GraphNode = z.infer<typeof graphNodeSchema>;
export type GraphEdge = z.infer<typeof graphEdgeSchema>;

export const articleSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    locale: localeSchema,
    translationOf: z.string().optional(),
    sourceContentHash: z.string().min(8),
    title: z.string().min(1),
    eyebrow: z.string().min(1),
    dek: z.string().min(1),
    status: reviewStatusSchema,
    sourceSnapshot: z.string().min(1),
    readingMinutes: z.number().int().positive(),
    learningObjectives: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()),
    sections: z.array(articleSectionSchema).min(1),
    citations: z.array(citationSchema).min(1),
    examples: z.array(exampleManifestSchema).min(1),
    engineResults: z.array(engineResultSchema),
    graph: z.object({ nodes: z.array(graphNodeSchema), edges: z.array(graphEdgeSchema) }),
  })
  .superRefine((article, context) => {
    const citationIds = new Set(article.citations.map(({ id }) => id));
    const claimIds = new Set<string>();
    for (const section of article.sections) {
      for (const block of section.blocks) {
        if (block.type === "claims") {
          for (const claim of block.claims) {
            claimIds.add(claim.id);
            for (const citationId of claim.citationIds) {
              if (!citationIds.has(citationId)) {
                context.addIssue({
                  code: "custom",
                  message: `Claim ${claim.id} references missing citation ${citationId}`,
                });
              }
            }
            if (article.status === "READY" && claim.classification === "UNCERTAIN") {
              context.addIssue({
                code: "custom",
                message: `READY article contains UNCERTAIN claim ${claim.id}`,
              });
            }
          }
        }
      }
    }
    for (const example of article.examples) {
      for (const claimId of example.claimIds) {
        if (!claimIds.has(claimId)) {
          context.addIssue({
            code: "custom",
            message: `Example ${example.id} references missing claim ${claimId}`,
          });
        }
      }
      for (const citationId of example.citationIds) {
        if (!citationIds.has(citationId)) {
          context.addIssue({
            code: "custom",
            message: `Example ${example.id} references missing citation ${citationId}`,
          });
        }
      }
    }
  });

export type Article = z.infer<typeof articleSchema>;
export type CompiledArticle = Article & {
  exampleSources: Record<string, string>;
  bytecodeArtifacts: Record<string, V8BytecodeArtifact>;
  representationArtifacts: Record<string, V8ValueRepresentationArtifact>;
};

export const specNodeSchema = z.object({
  id: z.string(),
  kind: z.enum(["clause", "algorithm", "step", "grammar", "operation", "type"]),
  title: z.string(),
  anchor: z.string(),
  fingerprint: z.string().min(8),
  parentId: z.string().optional(),
});
export const specEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  kind: z.enum(["contains", "calls", "references", "uses-type", "may-abrupt"]),
  weight: z.number().positive().default(1),
});
export type SpecNode = z.infer<typeof specNodeSchema>;
export type SpecEdge = z.infer<typeof specEdgeSchema>;
