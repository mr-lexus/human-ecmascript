# Human ECMAScript planning package

This package is the decision record and delivery contract for a bilingual, evidence-backed
guide to ECMA-262. The normative baseline is the stable ECMAScript 2026 snapshot; the living
specification is only a change-detection input.

## Delivery map

- [Architecture](architecture.md): boundaries, data flow, and public TypeScript interfaces.
- [Content pipeline](content-pipeline.md): pinned sources, extraction, bounded context, and review.
- [Data model](data-model.md): claims, citations, articles, graphs, examples, and provenance.
- [Quality model](quality-model.md): gates, publication states, locale parity, and staleness.
- [WSL environment](wsl-environment.md): reproducible Linux bootstrap and doctor behavior.
- [Vertical slice](vertical-slice.md): Reference Records through method calls and `this`.
- [Roadmap](roadmap.md): milestone outcomes, dependencies, and release gates.
- [Risks](risks.md): detection, mitigation, and fallback policy.
- [Decisions](decisions.md): accepted, spike-dependent, deferred, and rejected choices.
- [`roadmap.json`](roadmap.json): 155 machine-readable implementation tasks.

## Current implementation status

M1 is implemented. The first M3–M7 vertical-slice artifact is also present: structured EN/RU
content, graph primitives, bounded context logic, static learning pages, a browser sandbox,
and an engine evidence UI. Full ECMA-262 ingestion, Test262 indexing, SpiderMonkey/JSC capture,
ESMeta, and the V8 implementation layer remain gated roadmap work and are never represented as
complete in the product.

Terminology: AO means abstract operation; SDO means syntax-directed operation; claim means one
reviewable technical assertion; evidence means a normative citation, a derivation, an observable
test, or a pinned implementation artifact.
