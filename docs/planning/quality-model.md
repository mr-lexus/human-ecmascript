# Quality and review model

## Publication states

`DRAFT -> TECH_REVIEW -> VERIFIED_EN -> TRANSLATED_RU -> LOCALE_REVIEW -> READY`.
`STALE` removes previously ready content from release eligibility after a source fingerprint change.
`BLOCKED` records an unresolved evidence, security, or licensing issue.

## Gates

- G0 provenance: source, tool, and engine pins, hashes, and notices exist.
- G1 extraction: deterministic normalized spec and graph integrity pass.
- G2 English: every claim has sufficient evidence and independent review.
- G3 examples: parsing, isolation, assertions, timeouts, and failures pass.
- G4 observable: Test262 relevance is reviewed and engine results have provenance.
- G5 Russian: semantic parity, terminology, technical review, and editorial review pass.
- G6 publication: static build, links, accessibility, licenses, stale checks, and budgets pass.

Schemas, references, graph integrity, fingerprints, locale structure, terminology, examples, and
builds are automated. Claim entailment, Test262 relevance, translation semantics, and source mapping
are assisted but reviewed. Technical prose, Russian wording, licensing, and V8 interpretation require
a human decision.

## Staleness

Fingerprint clause headers, algorithms, grammar, and cross references separately. A changed cited
fragment marks dependent claims and articles stale. `oldids` and similarity may propose remapping but
cannot clear stale state. Editorial-only upstream changes can be triaged faster but are not silently
accepted.
