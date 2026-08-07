#!/usr/bin/env bash
set -euo pipefail

he_expected_sha="d6c664df3f3f61458e8c277585571328522d705166723a7c7823a9253a4d15a0"
he_archive="${1:-/tmp/node-v24.18.1-linux-x64.tar.xz}"
he_root="${PWD}"

if [[ ! -f "${he_root}/pnpm-workspace.yaml" ]]; then
  echo "Run bootstrap-wsl.sh from the Human ECMAScript workspace root." >&2
  exit 1
fi
if ! grep -qi microsoft /proc/version; then
  echo "WSL2 was not detected." >&2
  exit 1
fi
if [[ ! -f "${he_archive}" ]]; then
  echo "Node archive not found: ${he_archive}" >&2
  exit 1
fi

he_actual_sha="$(sha256sum "${he_archive}" | awk '{print $1}')"
if [[ "${he_actual_sha}" != "${he_expected_sha}" ]]; then
  echo "Node archive SHA-256 mismatch." >&2
  exit 1
fi

mkdir -p "${he_root}/.toolchains"
if [[ ! -x "${he_root}/.toolchains/node-v24.18.1-linux-x64/bin/node" ]]; then
  tar -xJf "${he_archive}" -C "${he_root}/.toolchains"
fi

source "${he_root}/scripts/wsl-env.sh"
corepack install --global pnpm@11.4.0
corepack enable
pnpm doctor

