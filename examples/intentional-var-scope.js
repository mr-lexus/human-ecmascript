"use strict";

function selectSource(mode) {
  if (mode === "cache") {
    var result = "cached value";
  }
  if (mode === "network") {
    // Repeating var intentionally refers to the same function-scoped binding.
    // eslint-disable-next-line no-redeclare
    var result = "network value";
  }
  return result ?? "no value";
}

console.log(selectSource("cache"));
console.log(selectSource("network"));
console.log(selectSource("offline"));
