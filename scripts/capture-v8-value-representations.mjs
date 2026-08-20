import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = join(workspaceRoot, "artifacts/v8/value-representations.json");
const cases = [
  { id: "smi", expression: "42", specType: "Number" },
  { id: "heap-number", expression: "3.141592653589793", specType: "Number" },
  { id: "string", expression: '"hello"', specType: "String" },
  { id: "symbol", expression: 'Symbol("guide")', specType: "Symbol" },
  { id: "bigint", expression: "12345678901234567890n", specType: "BigInt" },
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function captureValue({ id, expression, specType }) {
  const harness = `const value = ${expression}; console.log("IS_SMI:" + %IsSmi(value)); %DebugPrint(value);`;
  const result = spawnSync(process.execPath, ["--allow-natives-syntax", "-e", harness], {
    cwd: workspaceRoot,
    encoding: "utf8",
    timeout: 5_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${id} capture exited with ${result.status}`);
  const output = `${result.stdout}\n${result.stderr}`;
  const isSmiMatch = output.match(/IS_SMI:(true|false)/);
  if (!isSmiMatch) throw new Error(`Missing %IsSmi result for ${id}`);
  const isSmi = isSmiMatch[1] === "true";
  const debugType = isSmi
    ? "Smi"
    : (output.match(/\[([^\]]+)]/)?.[1] ?? output.match(/- type: ([A-Z0-9_]+)/)?.[1]);
  if (!debugType) throw new Error(`Missing %DebugPrint type for ${id}`);
  const mapType = output.match(/- type: ([A-Z0-9_]+)/)?.[1];
  const debugSummary = isSmi
    ? [`DebugPrint: Smi (${expression})`, "%IsSmi: true"]
    : [`DebugPrint: [${debugType}]`, ...(mapType ? [`map type: ${mapType}`] : []), "%IsSmi: false"];

  return {
    id,
    expression,
    specType,
    isSmi,
    storage: isSmi ? "tagged-immediate" : "heap-object",
    debugType,
    debugSummary,
  };
}

function buildArtifact(capturedAt) {
  const capturedCases = cases.map(captureValue);
  return {
    schemaVersion: 1,
    id: "value-representations",
    provider: "V8 tagged values",
    runtime: {
      name: "Node.js",
      version: process.versions.node,
      v8Version: process.versions.v8,
      platform: `${process.platform}-${process.arch}`,
      binarySha256: sha256(readFileSync(process.execPath)),
    },
    commandTemplate:
      'node --allow-natives-syntax -e "const value = <expression>; %IsSmi(value); %DebugPrint(value)"',
    capturedAt,
    cases: capturedCases,
    captureSha256: sha256(JSON.stringify(capturedCases)),
  };
}

const shouldWrite = process.argv.includes("--write");
const currentArtifact = shouldWrite ? undefined : JSON.parse(readFileSync(artifactPath, "utf8"));
const artifact = buildArtifact(
  currentArtifact?.capturedAt ?? new Date().toISOString().slice(0, 10),
);

if (shouldWrite) {
  writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`Wrote ${artifactPath}`);
} else if (JSON.stringify(currentArtifact) !== JSON.stringify(artifact)) {
  throw new Error("V8 value-representation artifact is stale; run pnpm representations:capture");
} else {
  console.log(
    `V8 value representations verified: ${artifact.cases.length} values, ${artifact.runtime.version} / ${artifact.runtime.v8Version}`,
  );
}
