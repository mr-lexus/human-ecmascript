# Roadmap

The authoritative task inventory is [`roadmap.json`](roadmap.json). It contains 155 decision-complete
items with dependencies, kind, priority, relative size, risk, acceptance checks, subsystems, parallel
group, milestone, and user value. `scripts/generate-roadmap.mjs` is the deterministic source and
`pnpm roadmap:check` prevents drift.

| Milestone | Outcome                             | Release gate                                  |
| --------- | ----------------------------------- | --------------------------------------------- |
| M0        | Research and decision freeze        | Every P0 spike has evidence and fallback      |
| M1        | WSL bootstrap and bilingual shell   | Clean WSL checks and static build             |
| M2        | Deterministic ES2026 ingestion      | Byte-identical extraction and integrity       |
| M3        | Knowledge graph and bounded context | Cycles, budgets, and manifests validated      |
| M4        | Content publication model           | Claims, citations, staleness, and parity gate |
| M5        | English vertical slice              | Independent review and no uncertainty         |
| M6        | Test262 and three engines           | Isolated reproducible V8/SM/JSC evidence      |
| M7        | Russian public MVP                  | Locale, WCAG, license, and release gates      |
| M8        | Optional ESMeta layer               | Provenance and graceful degradation           |
| M9        | V8 implementation layer             | Versioned, explicitly non-normative artifacts |
| M10       | Scale and v1                        | Repeatable updates and contributor governance |

Work has no calendar estimates. Relative sizes and gates control scope. M8 and M9 cannot block the
static bilingual MVP.
