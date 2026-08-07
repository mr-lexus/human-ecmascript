# Content pipeline

## Source acquisition

`data/sources.lock.yaml` records URL, role, ref, resolved commit, archive SHA-256, license notice,
and redistribution policy. A future `sources:fetch` command downloads into `.cache/sources`, verifies
the archive before extraction, and emits a build manifest. CI caches by lock hash. Entire upstream
repositories and normative prose are not committed.

ES2026, Ecmarkup, and Test262 currently have resolved commits and verified archive hashes. A source
may still be marked as awaiting compatibility work; that is a feature-level gate, never a wildcard.
The hand-authored first slice links directly to stable ES2026 clauses.

## Extraction and graph

1. Run pinned Ecmarkup against pinned `spec.html` and request biblio/rendered output.
2. Parse semantic elements, structured headers, algorithms, steps, grammar, xrefs, and effects.
3. Preserve original anchors, `oldids`, and source spans.
4. Normalize nodes and edges, then sort before serialization.
5. Hash headers, algorithm trees, grammar, and references independently.
6. Reject duplicate IDs, dangling edges, missing parents, or unexplained cardinality changes.
7. Run extraction twice and compare artifact hashes.

The Ecmarkup CLI is the baseline contract. A programmatic API is used only after a fixture-backed
compatibility spike and remains hidden behind an adapter.

## Bounded context and AI

Context requests specify targets, snapshot, locale, byte/token budget, outbound depth, reverse
limit, accepted evidence, and approved-content policy. Direct calls/types/grammar outrank parents;
reverse references are top-K and degree-penalized. SCCs are included once with an explicit cycle
summary. Defaults are outbound depth 2, type/grammar depth 1, and 10 reverse references.

Every package lists included, excluded, and truncated nodes with scores and reasons. Verified prose
is reusable only when its source fingerprint still matches. AI receives this package and must return
schema-valid draft blocks. It cannot promote publication state.

## Bilingual publication

English is written and independently reviewed first. Russian translates the same semantic section,
block, claim, trace-step, operation, and example IDs. Operation names, internal slots, clause IDs,
and source code are not translated. A terminology file controls approved explanatory wording.
Structural drift, changed English source hashes, or missing claims block the Russian release.
