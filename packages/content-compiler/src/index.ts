import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  articleSchema,
  type Article,
  type CompiledArticle,
  type Locale,
  v8BytecodeArtifactSchema,
} from "@human-ecmascript/model";
import { parse } from "yaml";

export function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) return current;
    current = dirname(current);
  }
  throw new Error(`Cannot find workspace root from ${start}`);
}

export function loadArticle(
  locale: Locale,
  slug: string,
  root = findWorkspaceRoot(),
): CompiledArticle {
  const path = join(root, "content", "articles", locale, `${slug}.yaml`);
  const article = articleSchema.parse(parse(readFileSync(path, "utf8")));
  const exampleSources = Object.fromEntries(
    article.examples.map((example) => [
      example.id,
      readFileSync(join(root, example.sourcePath), "utf8").trim(),
    ]),
  );
  const bytecodeBlocks = article.sections
    .flatMap(({ blocks }) => blocks)
    .filter((block) => block.type === "bytecode");
  const bytecodeArtifacts = Object.fromEntries(
    [...new Set(bytecodeBlocks.map(({ artifactId }) => artifactId))].map((artifactId) => {
      const artifact = v8BytecodeArtifactSchema.parse(
        JSON.parse(readFileSync(join(root, "artifacts", "v8", `${artifactId}.json`), "utf8")),
      );
      if (artifact.id !== artifactId) {
        throw new Error(
          `Bytecode artifact id mismatch: expected ${artifactId}, received ${artifact.id}`,
        );
      }
      return [artifactId, artifact];
    }),
  );
  for (const block of bytecodeBlocks) {
    const artifact = bytecodeArtifacts[block.artifactId]!;
    const artifactCaseIds = new Set(artifact.cases.map(({ id }) => id));
    for (const item of block.cases) {
      if (!artifactCaseIds.has(item.caseId)) {
        throw new Error(`Bytecode block ${block.id} references missing case ${item.caseId}`);
      }
    }
  }
  return { ...article, exampleSources, bytecodeArtifacts };
}

export function listArticleSlugs(locale: Locale, root = findWorkspaceRoot()): string[] {
  return readdirSync(join(root, "content", "articles", locale), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yaml"))
    .map((entry) => entry.name.slice(0, -".yaml".length))
    .sort();
}

function semanticShape(article: Article): string[] {
  return article.sections.flatMap((section) => [
    `section:${section.id}`,
    ...section.blocks.flatMap((block) => [
      `block:${block.id}:${block.type}`,
      ...(block.type === "claims" ? block.claims.map(({ id }) => `claim:${id}`) : []),
      ...(block.type === "trace" ? block.steps.map(({ id }) => `step:${id}`) : []),
      ...(block.type === "operations" ? block.operations.map(({ id }) => `operation:${id}`) : []),
      ...(block.type === "bytecode"
        ? block.cases.map(({ id, caseId }) => `bytecode:${id}:${caseId}`)
        : []),
    ]),
  ]);
}

export function validateContentPair(en: Article, ru: Article): void {
  if (ru.translationOf !== en.id) throw new Error(`Russian article must translate ${en.id}`);
  const sourceHash = computeArticleSourceHash(en);
  if (en.sourceContentHash !== sourceHash)
    throw new Error(`English sourceContentHash is stale for ${en.id}: expected ${sourceHash}`);
  if (ru.sourceContentHash !== sourceHash)
    throw new Error(
      `Russian translation is stale for ${en.id}: expected sourceContentHash ${sourceHash}`,
    );
  const enShape = semanticShape(en);
  const ruShape = semanticShape(ru);
  if (JSON.stringify(enShape) !== JSON.stringify(ruShape)) {
    throw new Error(`Locale semantic structure differs for ${en.id}`);
  }
  const enExamples = en.examples.map(({ id }) => id);
  const ruExamples = ru.examples.map(({ id }) => id);
  if (JSON.stringify(enExamples) !== JSON.stringify(ruExamples)) {
    throw new Error(`Locale example structure differs for ${en.id}`);
  }
}

export function computeArticleSourceHash(article: Article): string {
  const source = {
    id: article.id,
    sourceSnapshot: article.sourceSnapshot,
    title: article.title,
    eyebrow: article.eyebrow,
    dek: article.dek,
    learningObjectives: article.learningObjectives,
    prerequisites: article.prerequisites,
    sections: article.sections,
    citations: article.citations,
    examples: article.examples,
    graph: article.graph,
  };
  return createHash("sha256").update(JSON.stringify(source)).digest("hex").slice(0, 16);
}
import { createHash } from "node:crypto";
