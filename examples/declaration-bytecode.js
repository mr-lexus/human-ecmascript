"use strict";

/* eslint-disable @typescript-eslint/no-unused-vars -- this fixture intentionally captures shadowed and unreachable bindings */

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

function shadowedLetBeforeDeclaration() {
  let p2 = 1;
  let p1 = 5;
  {
    p2 = 7;
    let p2;
    let p3 = p1 + p2;
  }
  return;
}

function initializedShadowedLet() {
  let p2 = 1;
  let p1 = 5;
  {
    let p2;
    p2 = 7;
    let p3 = p1 + p2;
    return p3;
  }
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

try {
  shadowedLetBeforeDeclaration();
} catch (error) {
  console.log(error.name);
}

console.log(initializedShadowedLet());
