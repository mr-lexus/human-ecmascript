# Human ECMAScript

> **Alpha notice:** Human ECMAScript is an active, unfinished research and education project. Its
> explanations, examples, evidence, and conclusions may change substantially. Do not use this site
> as your only source or treat it as authoritative. Verify every important claim against ECMA-262,
> engine documentation, and your own tests.

**Live site:** [mr-lexus.github.io/human-ecmascript](https://mr-lexus.github.io/human-ecmascript/)

Русская версия: [README.ru.md](README.ru.md)

## What this project is

Human ECMAScript is a bilingual (English/Russian), evidence-backed field guide to ECMAScript and
the ECMA-262 specification. It is designed to make specification algorithms navigable without
pretending that every statement has the same authority.

The first vertical slice follows familiar JavaScript questions all the way down to the model used
by the standard:

- how `obj.method()` becomes a Reference Record, property access, and a `this` binding;
- how `const`, `let`, and `var` differ during initialization, TDZ checks, scoping, and loops;
- how primitive values, bindings, and Reference Records relate to observable JavaScript behavior;
- where a claim is about ECMA-262, a derived explanation, an observable test, or a V8 detail.

The project is not a replacement for the specification, a browser compatibility database, or a
performance benchmark. It is a learning and investigation surface that points back to primary
sources.

## How the site is made

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
