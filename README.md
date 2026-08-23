# Human ECMAScript

> **Alpha notice:** Human ECMAScript is an active, unfinished research and education project. Its
> explanations, examples, evidence, and conclusions may change substantially. Do not use this site
> as your only source or treat it as authoritative. Verify every important claim against ECMA-262,
> engine documentation, and your own tests.

**Live site:** [mr-lexus.github.io/human-ecmascript](https://mr-lexus.github.io/human-ecmascript/)

Русская версия: [README.ru.md](README.ru.md)

## What this project is

Human ECMAScript is an evidence-backed research and learning platform for ECMAScript. Instead of
treating prose as the source of truth, the project models individual technical claims and connects
them to ECMA-262 algorithms, executable observations, and versioned engine evidence. The public
website is only the presentation layer: the source of truth is the structured content, the pinned
sources, and the validation pipeline that compiles them.

The first vertical slice follows familiar JavaScript questions all the way down to the model used
by the standard:

- how `obj.method()` becomes a Reference Record, property access, and a `this` binding;
- how `const`, `let`, and `var` differ during initialization, TDZ checks, scoping, and loops;
- how primitive values, bindings, and Reference Records relate to observable JavaScript behavior;
- where a claim is about ECMA-262, a derived explanation, an observable test, or a V8 detail.

The project is not a replacement for the specification, a browser compatibility database, or a
performance benchmark. It is a learning and investigation surface that points back to primary
sources.

## What this project is not

Human ECMAScript is not:

- a replacement for ECMA-262 — it points back to the specification and never republishes it;
- another MDN — it investigates selected questions deeply instead of covering the web platform;
- a compatibility database — engine results are pinned evidence about specific builds, not browser matrices;
- a generic performance guide — it does not rank constructs by speed;
- a V8 documentation mirror — V8 artifacts are one engine's evidence, explicitly non-normative;
- an AI-generated encyclopedia — AI may assist search, synthesis, drafting, and translation, but AI output is never treated as evidence. Published claims trace back to primary specifications and documentation, reproducible observable behavior, versioned implementation evidence, and explicit human review.

## How we establish knowledge

The methodology starts with a concrete JavaScript question, not with an attempt to retell an entire
specification chapter. We reduce that question to small claims and require each claim to carry its
own evidence and authority label. An article is assembled through the following process:

1. **Frame a falsifiable question.** We begin with behavior a reader can recognize, such as why a
   method call receives a particular `this` value or when a lexical binding becomes initialized.
   The question is split into claims that can be supported, challenged, or marked unresolved.
2. **Establish the normative baseline.** The stable, pinned ECMA-262 edition is the primary source
   for language semantics. We locate the relevant grammar, definitions, abstract operations, and
   algorithm steps and preserve their clause IDs and links. An isolated quotation is not enough:
   the investigation follows the complete chain of operations that produces the behavior.
3. **Build an explicit reasoning trace.** When the specification does not state a reader-facing
   conclusion verbatim, we derive it step by step from cited algorithms. Derived explanations are
   kept distinct from normative statements so that the reasoning can be inspected rather than
   accepted on authority.
4. **Design pressure tests.** Small executable examples target the boundary of each claim: detached
   calls, getters, computed keys, TDZ access, shadowing, aliasing, mutation, and similar cases. A
   test demonstrates observable behavior in a stated runtime; it does not rewrite or replace the
   specification.
5. **Inspect implementations only when the question requires it.** Claims about storage, bytecode,
   or optimization use pinned engine documentation, source code, and reproducible artifacts from a
   specific engine build. Version, V8 revision, platform, command, source fingerprint, and binary
   hash are recorded. Implementation evidence is never promoted to a universal JavaScript rule.
6. **Triangulate and classify the result.** Each published statement is classified as normative,
   derived, observable, host-defined, or implementation-specific. If specification text,
   experiment, and engine evidence appear to disagree, we narrow the claim or leave it unresolved;
   we do not silently blend the layers together.
7. **Review language and meaning separately.** English content is researched and technically
   reviewed first. The Russian version preserves the same sections, claims, trace steps, citations,
   and examples, while a controlled terminology list keeps technical vocabulary consistent.
   Semantic parity and editorial quality are checked independently.
8. **Invalidate knowledge when its inputs change.** Source fragments and normalized artifacts are
   fingerprinted. A changed specification clause, example, engine binary, or derived artifact marks
   dependent material stale until it is reviewed again.

AI may assist with search, bounded-context synthesis, drafting, translation, and consistency checks,
but it is not treated as a source. It receives a limited source package, must produce structured
drafts, and cannot by itself promote material to a verified publication state. Primary-source
mapping, technical interpretation, claim entailment, translation semantics, and final publication
remain review decisions.

## How the site is made

The public website is the presentation layer, not the project's source of truth.

The public site is a static Next.js export. There is no runtime server, database, account system,
or live execution service behind the deployed pages.

1. **Sources are pinned.** Specification and implementation references are recorded with resolved
   commits or stable URLs in `data/`.
2. **Content is structured.** Articles live as validated YAML in `content/articles/en` and
   `content/articles/ru`, with claims, citations, examples, and evidence layers kept separate.
3. **The compiler publishes content.** `packages/content-compiler` loads the article model and
   produces the data consumed by the web app.
4. **Validation blocks drift.** The validation package checks English/Russian parity, executable
   example output, citation references, source locks, and artifact provenance.
5. **Engine evidence is pinned.** V8 bytecode and value-representation artifacts are captured with
   the project’s pinned Linux Node.js 24.18.1 runtime. These artifacts describe one V8 build; they
   are not universal rules for every JavaScript engine.
6. **The browser provides the interaction.** Code examples run in an isolated Web Worker with
   bounded input, output, and execution time. The resulting site is exported to `apps/web/out`.
7. **GitHub Actions publishes it.** A push to `main` runs the checks, builds the export, uploads the
   Pages artifact, and deploys it to GitHub Pages.

## Why so much machinery for a few articles?

Because the current articles are a vertical slice of the system, not the intended scope of the
system. The slice exists to validate whether evidence-backed technical knowledge can be represented,
checked, translated, invalidated, and published repeatably — before scaling content volume. The
machinery is the point of the experiment; the article count is not.

## Current implementation status

To keep the project honest about its alpha state:

- **Implemented now:** structured claim model with authority classifications and review states; EN/RU semantic parity validation; executable examples with expected output verified on every build; pinned V8 baselines plus bytecode and value-representation artifacts with source, capture, and binary fingerprints; pinned upstream sources (ECMA-262 ES2026, Ecmarkup, Test262 archive); browser sandbox for examples; static export; article-local knowledge graphs and bounded-context primitives.
- **Partial:** V8 implementation evidence covers one pinned Node/V8 build for the current slice only; review states are modeled and enforced, but review is performed by the project author — independent review at scale is a goal; staleness protection currently means fingerprints checked at build time (source hashes, artifact hashes, EN/RU source-content hashes).
- **Roadmap, not implemented:** complete ECMA-262 ingestion; Test262 indexing (the source is pinned for future indexing); SpiderMonkey and JavaScriptCore execution (engine pins pending); automatic invalidation driven by upstream specification changes; the ESMeta layer; a scaled knowledge graph.

## Repository map

```text
apps/web/                  Next.js App Router site and browser interactions
content/articles/          Bilingual article content (EN/RU YAML)
packages/model/            Shared schemas and evidence contracts
packages/content-compiler  Content loading and publication-shaped data
packages/context-builder   Bounded context construction for future expansion
packages/knowledge-graph   Deterministic graph and relationship queries
packages/validation/       Release-blocking content and security checks
artifacts/v8/              Pinned, normalized V8 evidence artifacts
data/                      Source, terminology, and engine locks
docs/planning/             Architecture, decisions, roadmap, and quality model
scripts/                   Capture, validation, and WSL environment helpers
```

## Local development

The repository’s supported development environment is WSL2 with the pinned Linux toolchain. From
the repository root:

```bash
source scripts/wsl-env.sh
corepack enable
pnpm doctor
pnpm install --frozen-lockfile
pnpm dev
```

The web app is then available at the local URL printed by Next.js. To run the complete release
checks and produce the static export:

```bash
pnpm check
pnpm build
```

The deployable files are written to `apps/web/out`.

## Content workflow

When adding or changing a topic, update the structured article data rather than hard-coding a
lesson into a component:

1. Add or revise the English article in `content/articles/en`.
2. Add the Russian counterpart in `content/articles/ru` and keep both inventories in parity.
3. Attach primary citations and label the authority of each claim.
4. Add executable examples under `examples/` with bounded expected output.
5. Run `pnpm validate:content`, the artifact checks, and the full `pnpm check`.
6. Review the generated page in both languages before publishing.

## Deployment

The workflow in `.github/workflows/pages.yml` deploys the static export through GitHub Pages. The
repository Pages setting must use **GitHub Actions** as its source. The expected live URL is:

<https://mr-lexus.github.io/human-ecmascript/>

The project-base path is configured for the repository name `human-ecmascript`. If the repository
is renamed, update the Next.js base path and the canonical metadata/sitemap URLs before deploying.

## Reporting mistakes and contributing

The site is the presentation layer; the repository is where claims are challenged. You can:

- inspect the repository: <https://github.com/mr-lexus/human-ecmascript>;
- report a technical mistake: open an issue (article pages and individual claims link to prefilled issue templates);
- contribute or inspect the methodology: see [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/planning](docs/planning/README.md).

## Scope and limitations

- This is an alpha release with incomplete coverage and evolving explanations.
- A V8 artifact is evidence about one pinned V8/Node build, not a statement about all engines.
- Host behavior, browser behavior, optimization, and implementation details can differ from the
  normative specification.
- Content can contain mistakes. Reproduce important examples and consult the linked primary source.
- The browser sandbox is intentionally small and is not a general-purpose JavaScript runtime.

## Project documents

Planning documents, architectural decisions, the quality model, and the roadmap are collected in
[`docs/planning`](docs/planning/README.md).

## License

Code is licensed under Apache-2.0. Content and evidence have the terms described in
[`CONTENT-LICENSE.md`](CONTENT-LICENSE.md); see also [`LICENSE`](LICENSE).
