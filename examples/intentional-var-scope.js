"use strict";

function selectSourceWithVar(mode) {
  if (mode === "cache") {
    var result = "cached value";
  }
  if (mode === "network") {
    // In this ordinary function, repeated var declarations denote one VariableEnvironment binding.
    // eslint-disable-next-line no-redeclare
    var result = "network value";
  }
  return result ?? "no value";
}

function selectSourceWithLet(mode) {
  let result;
  if (mode === "cache") {
    result = "cached value";
  }
  if (mode === "network") {
    result = "network value";
  }
  return result ?? "no value";
}

for (const mode of ["cache", "network", "offline"]) {
  console.log(`${selectSourceWithVar(mode)} / ${selectSourceWithLet(mode)}`);
}
