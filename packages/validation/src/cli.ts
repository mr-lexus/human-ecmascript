import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  listArticleSlugs,
  loadArticle,
  validateContentPair,
} from "@human-ecmascript/content-compiler";

const slugs = listArticleSlugs("en");
const translatedSlugs = listArticleSlugs("ru");
if (JSON.stringify(slugs) !== JSON.stringify(translatedSlugs)) {
  throw new Error("English and Russian article inventories differ");
}

let exampleCount = 0;
const allExampleIds = new Set<string>();
for (const slug of slugs) {
  const en = loadArticle("en", slug);
  const ru = loadArticle("ru", slug);
  validateContentPair(en, ru);

  const sourcePaths = new Set(en.examples.map(({ sourcePath }) => sourcePath));
  if (sourcePaths.size !== en.examples.length)
    throw new Error(`Each ${slug} example must use a distinct source file`);

  for (const example of en.examples) {
    if (allExampleIds.has(example.id)) throw new Error(`Duplicate example id ${example.id}`);
    allExampleIds.add(example.id);
    const result = spawnSync(process.execPath, [join(process.cwd(), example.sourcePath)], {
      encoding: "utf8",
      timeout: example.timeoutMs,
      windowsHide: true,
    });
    if (result.error) throw new Error(`${example.id} failed to execute: ${result.error.message}`);
    if (result.status !== 0)
      throw new Error(`${example.id} exited with ${result.status}: ${result.stderr}`);
    const output = result.stdout.trim() ? result.stdout.trim().split(/\r?\n/) : [];
    if (JSON.stringify(output) !== JSON.stringify(example.expectedOutput)) {
      throw new Error(
        `${example.id} output mismatch: expected ${JSON.stringify(example.expectedOutput)}, received ${JSON.stringify(output)}`,
      );
    }
    for (const engineResult of en.engineResults.filter(
      ({ exampleId, status }) => exampleId === example.id && status === "verified",
    )) {
      if (JSON.stringify(engineResult.output) !== JSON.stringify(example.expectedOutput)) {
        throw new Error(`${example.id} verified engine result differs from its expected output`);
      }
    }
    exampleCount += 1;
  }

  for (const artifact of Object.values(en.bytecodeArtifacts)) {
    const source = readFileSync(join(process.cwd(), artifact.sourcePath));
    const sourceHash = createHash("sha256").update(source).digest("hex");
    if (sourceHash !== artifact.sourceSha256) {
      throw new Error(`${artifact.id} source fingerprint is stale`);
    }
    const captureHash = createHash("sha256").update(JSON.stringify(artifact.cases)).digest("hex");
    if (captureHash !== artifact.captureSha256) {
      throw new Error(`${artifact.id} normalized capture fingerprint is stale`);
    }
    const example = en.examples.find(({ sourcePath }) => sourcePath === artifact.sourcePath);
    if (!example) throw new Error(`${artifact.id} source is not exposed as an executable example`);
    const engineResult = en.engineResults.find(
      ({ exampleId, engine, status }) =>
        exampleId === example.id && engine === "V8" && status === "verified",
    );
    if (engineResult?.binaryHash !== artifact.runtime.binarySha256) {
      throw new Error(`${artifact.id} binary provenance differs from its V8 engine result`);
    }
  }
}

const sourceLock = readFileSync(join(process.cwd(), "data", "sources.lock.yaml"), "utf8");
const archiveHashes = [...sourceLock.matchAll(/archiveSha256:\s*([a-f0-9]{64})/g)];
const resolvedCommits = [...sourceLock.matchAll(/resolvedCommit:\s*([a-f0-9]{40})/g)];
if (
  archiveHashes.length !== 3 ||
  resolvedCommits.length !== 3 ||
  sourceLock.includes("pending-upstream")
) {
  throw new Error(
    "Every registered source must have a resolved 40-character commit and 64-character archive SHA-256",
  );
}

console.log(
  `Content validation passed: ${slugs.length} bilingual articles, ${exampleCount} verified V8 examples, EN/RU parity`,
);
