# Architecture

## Runtime boundary

The public application is a Next.js App Router static export. It has no server API, database,
accounts, runtime AI, or live multi-engine service. Source ingestion, engine execution, AI drafting,
and review all happen before publication. The browser receives only validated content and small,
partitioned artifacts.

```text
pinned upstream sources -> adapters -> normalized spec -> knowledge graph
                                                   |             |
Test262 -> metadata index -------------------------+             v
                                                        bounded context
                                                               |
structured EN -> evidence review -> RU parity/review -----------+
                                                               |
examples -> isolated offline engines -> result manifests -------+
                                                               v
                                  content compiler -> static EN/RU site
```

## Package boundaries

- `model` owns cross-package schemas and is the only shared contract.
- `spec-ingest` will hide Ecmarkup CLI/programmatic details behind `SpecAdapter`.
- `knowledge-graph` owns deterministic graph construction, indexes, SCCs, and diffs.
- `context-builder` owns weighted traversal, budgets, truncation, and package manifests.
- `content-compiler` owns YAML loading and publication-shaped content.
- `validation` owns release-blocking checks, not authoring transformations.
- `example-runner` and `engine-runner` will execute only out of process.
- `esmeta-adapter` and `v8-analyzer` are optional artifact providers.

## Stable interfaces

```ts
SpecAdapter.ingest(snapshot): NormalizedSpec
KnowledgeGraph.build(spec): GraphArtifact
KnowledgeGraph.query(request): Subgraph
KnowledgeGraph.diff(before, after): SpecChangeSet
ContextBuilder.build(request): ContextPackage
ContentCompiler.compile(locale, graph): PublishedContent
ExampleRunner.run(example, engine): EngineResult
ArtifactProvider.collect(request): DerivedArtifact
```

Adapter-specific Ecmarkup, ESMeta, Test262, or V8 wire shapes cannot cross these boundaries.
Canonical graph data is sorted JSON/JSONL. SQLite may be introduced only as a rebuildable local
index after measurement; it cannot become the source of truth.
