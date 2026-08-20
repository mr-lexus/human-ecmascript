"use strict";

function varAcrossBranch(flag) {
  if (flag) return value;
  var value = 7;
  return value;
}

function letAcrossBranch(flag) {
  if (flag) return value;
  let value = 7;
  return value;
}

function constAcrossBranch(flag) {
  if (flag) return value;
  const value = 7;
  return value;
}

function initializedLet(flag) {
  let value;
  if (flag) value = 7;
  return value;
}

function initializedConst(flag) {
  const value = flag ? 7 : 0;
  return value;
}

console.log(String(varAcrossBranch(true)));

for (const candidate of [letAcrossBranch, constAcrossBranch]) {
  try {
    candidate(true);
  } catch (error) {
    console.log(error.name);
  }
}

console.log(initializedLet(true));
console.log(initializedConst(true));
