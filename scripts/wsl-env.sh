#!/usr/bin/env bash

_he_root="${PWD}"
while [[ "${_he_root}" != "/" && ! -f "${_he_root}/pnpm-workspace.yaml" ]]; do
  _he_root="$(dirname "${_he_root}")"
done
if [[ ! -f "${_he_root}/pnpm-workspace.yaml" ]]; then
  echo "Run this script from the Human ECMAScript workspace or one of its subdirectories." >&2
  return 1 2>/dev/null || exit 1
fi
_he_node="${_he_root}/.toolchains/node-v24.18.1-linux-x64/bin"

if [[ ! -x "${_he_node}/node" ]]; then
  echo "Linux Node.js 24.18.1 is missing from ${_he_node}." >&2
  echo "Follow docs/planning/wsl-environment.md to install and verify it." >&2
  return 1 2>/dev/null || exit 1
fi

export PATH="${_he_node}:${PATH}"
export COREPACK_HOME="${_he_root}/.toolchains/corepack"
export PNPM_HOME="${_he_root}/.toolchains/pnpm-home"
export pnpm_config_store_dir="${_he_root}/.toolchains/pnpm-store"
export TMPDIR="${_he_root}/.toolchains/tmp"
mkdir -p "${TMPDIR}"
unset _he_node _he_root
