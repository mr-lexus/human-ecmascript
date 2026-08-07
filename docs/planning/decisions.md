# Decisions

## Accepted

- Stable ES2026 is normative; living ECMA-262 is a pinned diff input.
- WSL2 with a Linux filesystem, Node 24.18.1, pnpm 11.4.0, and exact package versions.
- TypeScript monorepo, Next static export, explicit `/en` and `/ru`, and GitHub Pages first.
- Mantine primitives with a custom educational design system.
- YAML, Zod, typed blocks, separate examples, and no arbitrary MDX/JSX.
- Sorted JSON/JSONL canonical graph, CodeMirror, build-time highlighting, and lazy Cytoscape.
- English review before Russian parity/review.
- Offline V8, SpiderMonkey, and JSC evidence for MVP; browser runs are separately labeled.
- Reference/property/call/`this` as the first complete slice.

## Requires a compatibility spike

Ecmarkup programmatic exports, ESMeta coverage/export shape, JSVU/JSC under WSL, d8 debug flags,
sandbox negative tests, and the value of a derived SQLite index. Each spike has a documented fallback;
none grants permission to leak upstream wire shapes into core packages.

## Deferred

ECMA-402, a full ESMeta debugger, advanced V8 optimization/deopt lessons, accounts, backend services,
cloud progress, runtime AI chat, historical editions, and whole-spec coverage.

## Rejected

Whole-spec LLM prompts, public HTML scraping as canonical ingestion, redistribution of the complete
normative text, unpinned living specs, Neo4j in MVP, arbitrary code in the web process, treating V8 as
normative, canonical MDX, Monaco, and React Flow.
