# WSL environment

## Required workflow

Use WSL2 x86-64 and a Linux filesystem. The canonical development checkout is:

```text
/home/lexus/src/human-ecmascript
```

The `/mnt/d/project/human-ecmascript` workspace is a synchronized source copy. Linux package binaries
on that 9p mount can fail with `EPERM`; installs, tests, and builds therefore run from `/home/lexus`.
Never use Windows Node, npm, or Corepack from WSL.

## Toolchain

- Node.js 24.18.1 Linux x64; official archive SHA-256:
  `d6c664df3f3f61458e8c277585571328522d705166723a7c7823a9253a4d15a0`.
- pnpm 11.4.0 through Corepack.
- Package versions are exact and `pnpm-lock.yaml` is committed.

After installing the verified Node archive into `.toolchains`, run:

```bash
cd /home/lexus/src/human-ecmascript
source scripts/wsl-env.sh
corepack enable
pnpm doctor
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

`wsl-env.sh` also redirects Corepack, pnpm store, and temporary sockets into the Linux workspace to
avoid inherited Windows paths. Doctor never installs software. It verifies WSL, architecture,
filesystem, ELF Node, exact versions, disk space, and reports optional Docker/JDK/engine capabilities.

Docker, Java/sbt, Playwright, and engine shells are not bootstrap requirements. Their absence is a
warning until the milestone that consumes them.

`scripts/bootstrap-wsl.sh /path/to/node-v24.18.1-linux-x64.tar.xz` verifies the official hash,
extracts the local toolchain, activates exact pnpm, and runs doctor. It never falls back to a
Windows executable.
