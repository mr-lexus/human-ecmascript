import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadArticle, validateContentPair } from "@human-ecmascript/content-compiler";

const slug = "reference-call-this";
const en = loadArticle("en", slug);
const ru = loadArticle("ru", slug);
validateContentPair(en, ru);

const sourcePaths = new Set(en.examples.map(({ sourcePath }) => sourcePath));
if (sourcePaths.size !== en.examples.length)
  throw new Error("Each example must use a distinct source file");

for (const example of en.examples) {
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
  `Content validation passed: ${slug} (${en.sections.length} sections, ${en.examples.length} verified V8 examples, EN/RU parity)`,
);
