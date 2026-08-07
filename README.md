# Human ECMAScript

Human ECMAScript is a bilingual, evidence-backed guide to ECMA-262. The first vertical
slice follows a JavaScript method call from a Reference Record through property access to
the final `this` binding.

## WSL quick start

```bash
source scripts/wsl-env.sh
corepack enable
pnpm doctor
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

The local Linux toolchain is intentionally separate from any Windows Node.js installation.
The deployable static site is generated in `apps/web/out`.

Project decisions and the full delivery roadmap live in [`docs/planning`](docs/planning/README.md).
