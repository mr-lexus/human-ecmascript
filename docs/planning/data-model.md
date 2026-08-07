# Data model

The executable schema is in `packages/model`. Zod validates runtime content; generated JSON Schema
will support editors and external agents.

## Evidence model

`Claim` has a stable ID, localized text, classification, citation IDs, source fingerprint,
confidence, and review state. The exact classifications are `NORMATIVE`, `DERIVED`, `OBSERVABLE`,
`HOST_DEFINED`, `IMPLEMENTATION_DEFINED`, `V8_IMPLEMENTATION`, `INFORMATIVE`, and `UNCERTAIN`.
`UNCERTAIN` is legal in drafts and illegal in a `READY` article.

`Citation` records source snapshot, spec node and optional step, stable URL, relevance, and evidence
hash. An execution result cannot replace normative evidence for a normative claim.

## Learning content

`Article` contains stable metadata, learning objectives, prerequisites, typed sections, citations,
example manifests, engine results, and a local graph. Typed blocks are prose, claims, operations,
traces, and notes. Markdown is limited to prose fields; arbitrary MDX/JSX is prohibited.

Examples live in separate `.js`/`.mjs` files. A manifest supplies goal, timeout, expected output,
claim/citation links, and allowed evidence. `EngineResult` records engine, exact distribution,
binary hash, verification state, output, capture time, and notes.

## Specification and provenance

`SpecSnapshot` owns edition, upstream commit, tool versions, and hashes. `SpecNode` covers clauses,
algorithms, steps, grammar, operations, and types. `SpecEdge` covers containment, calls, references,
type use, and abrupt completion. Derived ESMeta/V8 artifacts always include provider version, inputs,
source mapping, and confidence.
