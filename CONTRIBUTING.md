# Contributing

Use WSL2 and work on a Linux filesystem when possible. Run `source scripts/wsl-env.sh`
before invoking Node or pnpm. Every technical claim needs a classification and at least one
evidence record. English content is reviewed before translation; Russian content must keep
the same semantic section and claim identifiers.

Required checks:

```bash
pnpm doctor
pnpm check
pnpm build
```

Do not paste full normative specification text into the repository. Prefer stable clause
links and short, necessary excerpts whose license has been reviewed.
