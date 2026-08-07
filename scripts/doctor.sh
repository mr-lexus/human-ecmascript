#!/usr/bin/env bash
set -uo pipefail

failures=0
warnings=0

pass() { printf 'PASS  %s\n' "$1"; }
warn() { printf 'WARN  %s\n' "$1"; warnings=$((warnings + 1)); }
fail() { printf 'FAIL  %s\n' "$1"; failures=$((failures + 1)); }

if grep -qi microsoft /proc/version 2>/dev/null; then pass "running under WSL2"; else fail "WSL2 was not detected"; fi
if [[ "$(uname -m)" == "x86_64" ]]; then pass "architecture is x86_64"; else fail "expected x86_64, found $(uname -m)"; fi

fs_type="$(stat -f -c %T . 2>/dev/null || echo unknown)"
if [[ "${fs_type}" == "v9fs" || "${fs_type}" == "9p" ]]; then
  warn "workspace uses ${fs_type}; prefer /home/lexus/src/human-ecmascript for faster installs and watchers"
else
  pass "workspace filesystem is ${fs_type}"
fi

if command -v node >/dev/null 2>&1; then
  node_version="$(node --version)"
  node_kind="$(file -b "$(command -v node)" 2>/dev/null || true)"
  [[ "${node_version}" == "v24.18.1" ]] && pass "Node.js ${node_version}" || fail "expected Node.js v24.18.1, found ${node_version}"
  [[ "${node_kind}" == *ELF* ]] && pass "Node.js is a Linux ELF binary" || fail "Node.js is not a Linux ELF binary"
else
  fail "Linux Node.js is not on PATH; source scripts/wsl-env.sh"
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm_version="$(pnpm --version)"
  [[ "${pnpm_version}" == "11.4.0" ]] && pass "pnpm ${pnpm_version}" || fail "expected pnpm 11.4.0, found ${pnpm_version}"
else
  fail "pnpm is not on PATH; source scripts/wsl-env.sh"
fi

free_kb="$(df -Pk . | awk 'NR==2 {print $4}')"
if [[ "${free_kb:-0}" -gt 5242880 ]]; then pass "more than 5 GiB disk space is free"; else warn "less than 5 GiB disk space is free"; fi

for capability in docker java sbt d8 js jsc qjs; do
  if command -v "${capability}" >/dev/null 2>&1; then
    pass "optional capability ${capability} is available"
  else
    warn "optional capability ${capability} is unavailable"
  fi
done

printf '\nDoctor summary: %d failure(s), %d warning(s).\n' "${failures}" "${warnings}"
[[ "${failures}" -eq 0 ]]

