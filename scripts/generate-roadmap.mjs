import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const t = (id, title, priority, size, risk, kind = "build") => ({
  id,
  title,
  priority,
  size,
  risk,
  kind,
});

const milestones = [
  {
    id: "M0",
    title: "Research and decision freeze",
    value: "Retire risks that could force a rewrite of ingestion, execution, or hosting.",
    systems: ["research", "architecture", "provenance"],
    check: "Every P0 spike has a fixture-backed result and a documented fallback.",
    waves: [
      [
        t("R-001", "Confirm project and upstream license policy", "P0", "S", "HIGH", "research"),
        t("R-002", "Resolve the exact ES2026 source commit", "P0", "S", "MEDIUM", "research"),
        t("R-003", "Spike the Ecmarkup programmatic API", "P0", "SPIKE", "HIGH", "research"),
        t("R-004", "Spike ESMeta ES2026 coverage and exports", "P1", "SPIKE", "HIGH", "research"),
        t("R-005", "Audit Test262 clause mapping quality", "P0", "M", "MEDIUM", "research"),
        t("R-006", "Spike JSVU and JavaScriptCore on WSL2", "P0", "SPIKE", "HIGH", "research"),
      ],
      [
        t("R-007", "Probe d8 runtime capabilities", "P1", "SPIKE", "MEDIUM", "research"),
        t("R-008", "Complete browser sandbox threat model", "P0", "M", "HIGH", "security"),
        t("R-009", "Benchmark JSON against derived SQLite", "P1", "SPIKE", "MEDIUM", "research"),
        t("R-010", "Validate YAML authoring ergonomics", "P0", "S", "MEDIUM", "research"),
        t("R-011", "Validate static locale deployment", "P0", "S", "MEDIUM", "research"),
        t("R-012", "Freeze baseline architecture decisions", "P0", "S", "LOW", "architecture"),
      ],
    ],
  },
  {
    id: "M1",
    title: "WSL-first bootstrap and static shell",
    value: "A clean WSL checkout builds a bilingual static shell through one documented workflow.",
    systems: ["toolchain", "web", "ci"],
    check: "Doctor, checks, tests, and a static EN/RU build pass from a clean WSL checkout.",
    waves: [
      [
        t("B-001", "Create the WSL ext4 working checkout", "P0", "S", "MEDIUM"),
        t("B-002", "Add project licenses and notices", "P0", "S", "MEDIUM"),
        t("B-003", "Pin Node and pnpm with checksums", "P0", "S", "MEDIUM"),
        t("B-004", "Create the pnpm workspace and root scripts", "P0", "M", "LOW"),
      ],
      [
        t("B-005", "Create the Next.js static application", "P0", "M", "MEDIUM"),
        t("B-006", "Create the Mantine visual shell", "P0", "M", "MEDIUM"),
        t("B-007", "Generate explicit EN and RU routes", "P0", "S", "MEDIUM"),
        t("B-008", "Create the shared model package", "P0", "S", "LOW", "architecture"),
      ],
      [
        t("B-009", "Configure formatting lint and types", "P0", "S", "LOW", "validation"),
        t("B-010", "Configure Vitest", "P0", "S", "LOW", "validation"),
        t("B-011", "Implement WSL doctor profiles", "P0", "M", "MEDIUM", "validation"),
        t("B-012", "Create Ubuntu CI", "P0", "M", "MEDIUM"),
        t("B-013", "Create GitHub Pages deployment", "P1", "M", "MEDIUM", "release"),
        t("B-014", "Document contribution security and decisions", "P0", "S", "LOW"),
      ],
    ],
  },
  {
    id: "M2",
    title: "Deterministic ES2026 ingestion",
    value: "The specification becomes navigable, provenance-rich structured data.",
    systems: ["spec-ingest", "model", "web"],
    check: "Two extractions are byte-identical and all graph integrity fixtures pass.",
    waves: [
      [
        t("I-001", "Create the source lock schema", "P0", "S", "MEDIUM", "architecture"),
        t("I-002", "Implement verified source fetching and caching", "P0", "M", "MEDIUM"),
        t("I-003", "Implement the Ecmarkup adapter boundary", "P0", "L", "HIGH", "architecture"),
      ],
      [
        t("I-004", "Extract clauses", "P0", "M", "MEDIUM"),
        t("I-005", "Extract AO SDO and internal method headers", "P0", "L", "HIGH"),
        t("I-006", "Extract algorithms and steps", "P0", "L", "HIGH"),
        t("I-007", "Extract grammar productions", "P0", "L", "HIGH"),
        t("I-008", "Extract cross references calls and effects", "P0", "L", "HIGH"),
      ],
      [
        t("I-009", "Capture source spans and fingerprints", "P0", "M", "MEDIUM"),
        t("I-010", "Finalize normalized spec schemas", "P0", "M", "MEDIUM", "architecture"),
        t("I-011", "Implement sorted serializers", "P0", "S", "LOW"),
        t("I-012", "Create ingestion fixtures and goldens", "P0", "M", "MEDIUM", "validation"),
        t("I-013", "Implement ingestion integrity validation", "P0", "M", "HIGH", "validation"),
      ],
      [
        t("I-014", "Publish the specification explorer", "P1", "L", "MEDIUM"),
        t("I-015", "Publish provenance panels", "P0", "M", "LOW"),
        t("I-016", "Add deterministic ingestion CI", "P0", "M", "MEDIUM", "validation"),
      ],
    ],
  },
  {
    id: "M3",
    title: "Knowledge graph and bounded context",
    value:
      "Readers and agents can navigate real dependencies without loading the whole specification.",
    systems: ["knowledge-graph", "context-builder", "web"],
    check:
      "Cyclic graphs terminate, context packages explain inclusion, and output is deterministic.",
    waves: [
      [
        t("G-001", "Finalize edge taxonomy", "P0", "M", "MEDIUM", "architecture"),
        t("G-002", "Implement the knowledge graph builder", "P0", "L", "HIGH"),
        t("G-003", "Build reverse indexes", "P0", "M", "MEDIUM"),
        t("G-004", "Implement SCC and cycle handling", "P0", "M", "HIGH"),
      ],
      [
        t("G-005", "Implement graph diffing", "P0", "L", "HIGH"),
        t("G-006", "Implement the staleness index", "P0", "L", "HIGH"),
        t("G-007", "Implement weighted context scoring", "P0", "L", "HIGH"),
        t("G-008", "Enforce context budgets and cutoffs", "P0", "M", "MEDIUM"),
        t("G-009", "Reuse fingerprint-matched verified content", "P1", "M", "HIGH"),
      ],
      [
        t("G-010", "Emit context package manifests", "P0", "M", "MEDIUM"),
        t("G-011", "Create the context builder CLI", "P0", "M", "MEDIUM"),
        t("G-012", "Create deterministic context fixtures", "P0", "M", "HIGH", "validation"),
        t("G-013", "Publish a lazy Cytoscape subgraph", "P1", "L", "MEDIUM"),
        t("G-014", "Publish AO drawer and breadcrumbs", "P0", "L", "MEDIUM"),
        t("G-015", "Add the graph quality gate", "P0", "M", "MEDIUM", "validation"),
      ],
    ],
  },
  {
    id: "M4",
    title: "Content model and publication workflow",
    value: "Articles become reviewable evidence objects instead of unstructured prose.",
    systems: ["model", "content-compiler", "validation"],
    check:
      "Broken citations locale drift stale hashes and uncertain ready claims stop publication.",
    waves: [
      [
        t("C-001", "Define the article schema", "P0", "M", "MEDIUM", "architecture"),
        t("C-002", "Define claim and citation schemas", "P0", "M", "HIGH", "architecture"),
        t("C-003", "Define typed content blocks", "P0", "M", "MEDIUM", "architecture"),
        t("C-004", "Define atomic knowledge", "P0", "M", "MEDIUM", "architecture"),
        t(
          "C-005",
          "Define example test and engine references",
          "P0",
          "M",
          "MEDIUM",
          "architecture",
        ),
        t("C-006", "Define glossary entries", "P0", "S", "LOW", "architecture"),
      ],
      [
        t("C-007", "Define translation and parity schemas", "P0", "M", "HIGH", "architecture"),
        t(
          "C-008",
          "Define learning path and coverage schemas",
          "P1",
          "M",
          "MEDIUM",
          "architecture",
        ),
        t("C-009", "Generate JSON Schema from Zod", "P0", "S", "LOW"),
        t("C-010", "Implement the content compiler", "P0", "L", "HIGH"),
        t("C-011", "Integrate build-time Shiki", "P1", "S", "LOW"),
      ],
      [
        t("C-012", "Implement the publication state machine", "P0", "M", "HIGH", "validation"),
        t("C-013", "Validate claims and citations", "P0", "L", "HIGH", "validation"),
        t("C-014", "Lint bilingual terminology", "P0", "M", "MEDIUM", "validation"),
        t("C-015", "Validate locale semantic parity", "P0", "M", "HIGH", "validation"),
        t("C-016", "Record editorial review artifacts", "P0", "M", "MEDIUM", "validation"),
        t("C-017", "Publish how to read algorithms atom", "P0", "M", "MEDIUM", "content"),
        t("C-018", "Add the content CI gate", "P0", "M", "MEDIUM", "validation"),
      ],
    ],
  },
  {
    id: "M5",
    title: "English vertical slice",
    value: "The first complete topic explains this from syntax through runtime semantics.",
    systems: ["content", "web", "provenance"],
    check: "Every claim has evidence and readers can trace obj.method() to the this binding.",
    waves: [
      [
        t("V-001", "Map vertical-slice dependencies", "P0", "M", "HIGH", "content"),
        t("V-002", "Build the bounded slice context", "P0", "M", "MEDIUM", "content"),
        t("V-003", "Define outcomes and prerequisites", "P0", "S", "LOW", "content"),
      ],
      [
        t("V-004", "Author the Reference Record atom", "P0", "L", "HIGH", "content"),
        t("V-005", "Author Completion and GetValue atoms", "P0", "L", "HIGH", "content"),
        t("V-006", "Author the property access explanation", "P0", "L", "HIGH", "content"),
        t("V-007", "Author EvaluateCall and this", "P0", "L", "HIGH", "content"),
      ],
      [
        t("V-008", "Author observable pressure tests", "P0", "M", "MEDIUM", "content"),
        t("V-009", "Author side-effect and abrupt traces", "P0", "M", "HIGH", "content"),
        t("V-010", "Document common misconceptions", "P0", "S", "MEDIUM", "content"),
        t("V-011", "Audit all slice citations", "P0", "M", "HIGH", "validation"),
        t("V-012", "Publish the interactive topic UI", "P0", "XL", "HIGH"),
      ],
      [
        t("V-013", "Complete independent English review", "P0", "M", "HIGH", "validation"),
        t("V-014", "Create the English release candidate", "P0", "S", "MEDIUM", "release"),
      ],
    ],
  },
  {
    id: "M6",
    title: "Examples Test262 and three engines",
    value: "Normative explanations are backed by reproducible observable evidence.",
    systems: ["example-runner", "engine-runner", "web", "security"],
    check: "V8 SpiderMonkey and JSC run slice fixtures with provenance and sandbox tests pass.",
    waves: [
      [
        t("E-001", "Finalize runner threat model and contract", "P0", "M", "HIGH", "security"),
        t("E-002", "Define the example manifest", "P0", "M", "MEDIUM", "architecture"),
        t("E-003", "Implement disposable container execution", "P0", "XL", "HIGH", "security"),
        t("E-004", "Define the engine adapter protocol", "P0", "M", "HIGH", "architecture"),
      ],
      [
        t("E-005", "Pin JSVU and engine distributions", "P0", "M", "HIGH"),
        t("E-006", "Implement the V8 adapter", "P0", "M", "MEDIUM"),
        t("E-007", "Implement the SpiderMonkey adapter", "P0", "M", "MEDIUM"),
        t("E-008", "Implement the JavaScriptCore adapter", "P0", "M", "HIGH"),
        t("E-009", "Implement optional QuickJS adapter", "P2", "M", "MEDIUM"),
      ],
      [
        t("E-010", "Index Test262 metadata", "P0", "L", "HIGH"),
        t("E-011", "Review Test262 relevance mappings", "P0", "L", "HIGH", "validation"),
        t("E-012", "Finalize curated slice examples", "P0", "L", "MEDIUM", "content"),
        t("E-013", "Generate the differential engine matrix", "P0", "M", "MEDIUM"),
        t("E-014", "Record run provenance and hashes", "P0", "M", "HIGH"),
      ],
      [
        t("E-015", "Implement the opaque browser sandbox", "P0", "L", "HIGH", "security"),
        t("E-016", "Integrate CodeMirror", "P1", "M", "MEDIUM"),
        t("E-017", "Publish the engine result matrix", "P0", "L", "MEDIUM"),
        t("E-018", "Add the engine CI job", "P0", "L", "HIGH", "validation"),
        t("E-019", "Add sandbox negative tests", "P0", "L", "HIGH", "security"),
      ],
    ],
  },
  {
    id: "M7",
    title: "Russian MVP and public release",
    value: "A reviewed bilingual module is publicly accessible as a static site.",
    systems: ["content", "localization", "web", "release"],
    check: "EN and RU parity accessibility licenses provenance and Pages deployment are green.",
    waves: [
      [
        t("L-001", "Seed the bilingual glossary", "P0", "M", "MEDIUM", "content"),
        t("L-002", "Translate the vertical slice", "P0", "XL", "HIGH", "content"),
        t("L-003", "Validate Russian terminology", "P0", "M", "HIGH", "validation"),
        t("L-004", "Validate semantic translation parity", "P0", "L", "HIGH", "validation"),
        t(
          "L-005",
          "Complete Russian technical and editorial review",
          "P0",
          "L",
          "HIGH",
          "validation",
        ),
      ],
      [
        t("L-006", "Publish locale comparison UI", "P1", "M", "MEDIUM"),
        t("L-007", "Generate static locale search indexes", "P0", "L", "MEDIUM"),
        t("L-008", "Publish coverage and learning map", "P1", "L", "MEDIUM"),
        t("L-009", "Complete WCAG audit", "P0", "L", "HIGH", "validation"),
        t("L-010", "Enforce performance and bundle budgets", "P0", "M", "MEDIUM", "validation"),
      ],
      [
        t("L-011", "Generate hreflang sitemap and metadata", "P1", "M", "LOW"),
        t("L-012", "Complete license and attribution gate", "P0", "M", "HIGH", "validation"),
        t("L-013", "Deploy to GitHub Pages", "P0", "M", "MEDIUM", "release"),
        t("L-014", "Publish the MVP release manifest", "P0", "S", "MEDIUM", "release"),
      ],
    ],
  },
  {
    id: "M8",
    title: "ESMeta enhancement",
    value:
      "Readers can correlate JavaScript execution with formal traces without depending on ESMeta at runtime.",
    systems: ["esmeta-adapter", "artifacts", "web"],
    check: "Missing ESMeta artifacts degrade gracefully and present traces have provenance.",
    waves: [
      [
        t("M-001", "Pin ESMeta JDK and sbt", "P1", "M", "HIGH"),
        t("M-002", "Implement the ESMeta process adapter", "P1", "L", "HIGH"),
        t("M-003", "Map ESMeta outputs to stable IDs", "P1", "L", "HIGH"),
        t("M-004", "Normalize CFG and trace artifacts", "P1", "XL", "HIGH"),
        t("M-005", "Record formal trace provenance", "P1", "M", "HIGH"),
        t("M-006", "Publish synchronized trace UI", "P1", "XL", "HIGH"),
        t("M-007", "Validate ESMeta against the first slice", "P1", "L", "HIGH", "validation"),
        t("M-008", "Implement graceful ESMeta degradation", "P1", "M", "MEDIUM"),
        t("M-009", "Add optional ESMeta CI", "P2", "L", "HIGH", "validation"),
      ],
    ],
  },
  {
    id: "M9",
    title: "V8 implementation layer",
    value: "Advanced readers see one pinned implementation without confusing it with the standard.",
    systems: ["v8-analyzer", "artifacts", "web"],
    check: "Every V8 artifact is pinned and visibly implementation-specific.",
    waves: [
      [
        t("D-001", "Map V8 binary to source commit", "P1", "M", "HIGH"),
        t("D-002", "Probe V8 flags at runtime", "P1", "M", "MEDIUM"),
        t("D-003", "Capture and parse Ignition bytecode", "P1", "L", "HIGH"),
        t("D-004", "Version the bytecode instruction catalog", "P1", "L", "HIGH"),
        t("D-005", "Capture cold and feedback fixtures", "P1", "L", "HIGH"),
        t("D-006", "Capture optimization and deopt fixtures", "P2", "XL", "HIGH"),
      ],
      [
        t("D-007", "Cite relevant V8 source", "P1", "L", "HIGH", "content"),
        t("D-008", "Finalize V8 artifact provenance schema", "P1", "M", "HIGH", "architecture"),
        t("D-009", "Publish the V8 explanation mode", "P1", "XL", "HIGH"),
        t("D-010", "Enforce implementation labels", "P0", "S", "HIGH", "validation"),
        t("D-011", "Add V8 artifact golden tests", "P1", "L", "HIGH", "validation"),
        t("D-012", "Support an optional debug d8 build", "P2", "XL", "HIGH"),
      ],
    ],
  },
  {
    id: "M10",
    title: "Scale and v1",
    value:
      "The project becomes a maintainable learning system rather than a one-off demonstration.",
    systems: ["content", "maintenance", "release"],
    check: "Source updates produce a reviewed stale queue and new modules reuse the same pipeline.",
    waves: [
      [
        t("S-001", "Sequence core learning paths", "P1", "L", "MEDIUM", "content"),
        t("S-002", "Author the next content slices", "P1", "XL", "HIGH", "content"),
        t("S-003", "Publish the coverage dashboard", "P1", "L", "MEDIUM"),
        t("S-004", "Watch the living specification", "P1", "L", "HIGH"),
        t("S-005", "Generate change triage reports", "P1", "M", "HIGH"),
        t("S-006", "Operate the stale content queue", "P1", "L", "HIGH"),
        t("S-007", "Finalize contributor workflow", "P1", "M", "MEDIUM"),
        t("S-008", "Create release bundle and SBOM", "P1", "M", "MEDIUM", "release"),
        t(
          "S-009",
          "Add accessibility and performance regression checks",
          "P1",
          "L",
          "MEDIUM",
          "validation",
        ),
        t("S-010", "Complete v1 security review", "P0", "L", "HIGH", "security"),
        t("S-011", "Establish editorial governance", "P1", "M", "HIGH", "validation"),
        t("S-012", "Publish v1 acceptance and release", "P1", "L", "HIGH", "release"),
      ],
    ],
  },
];

const items = [];
let previousMilestoneGate = [];
for (const milestone of milestones) {
  let previousWave = previousMilestoneGate;
  for (let waveIndex = 0; waveIndex < milestone.waves.length; waveIndex += 1) {
    const wave = milestone.waves[waveIndex];
    for (const item of wave) {
      items.push({
        id: item.id,
        title: item.title,
        goal: `${item.title} so that ${milestone.value.charAt(0).toLowerCase()}${milestone.value.slice(1)}`,
        deliverable: `A reviewed and reproducible ${item.title.toLowerCase()} artifact.`,
        dependsOn: [...previousWave],
        kind: item.kind,
        priority: item.priority,
        size: item.size,
        risk: item.risk,
        done: [
          `${item.title} is implemented and documented.`,
          `${milestone.id} quality evidence is recorded.`,
        ],
        checks: [milestone.check],
        subsystems: milestone.systems,
        parallelGroup: `${milestone.id}-${String(waveIndex + 1).padStart(2, "0")}`,
        milestone: milestone.id,
        userValue: milestone.value,
      });
    }
    previousWave = wave.map(({ id }) => id);
  }
  previousMilestoneGate = previousWave;
}

if (items.length !== 155) throw new Error(`Expected 155 roadmap items, found ${items.length}`);

const output = `${JSON.stringify({ schemaVersion: 1, generatedAt: "2026-08-06", milestones: milestones.map(({ id, title, value, check }) => ({ id, title, userValue: value, gate: check })), items }, null, 2)}\n`;
const target = join(process.cwd(), "docs", "planning", "roadmap.json");

if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== output) {
    console.error("docs/planning/roadmap.json is stale. Run pnpm roadmap:generate.");
    process.exit(1);
  }
  console.log(`Roadmap is current: ${items.length} items.`);
} else {
  writeFileSync(target, output);
  console.log(`Generated ${target} with ${items.length} items.`);
}
