"use strict";

/* eslint-disable @typescript-eslint/no-unused-vars, no-redeclare, no-useless-assignment -- this fixture intentionally captures shadowed, repeated, and unreachable bindings */

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

function nestedWithoutShadowing() {
  let p2 = 1;
  {
    p2 = 7;
    let p3 = p2;
    return p3;
  }
}

function shadowedConstBeforeDeclaration() {
  const p2 = 1;
  {
    const p3 = p2;
    const p2 = 7;
    return p3 + p2;
  }
}

function initializedShadowedConst() {
  const p2 = 1;
  {
    const p2 = 7;
    const p3 = p2;
    return p3;
  }
}

function intentionalFunctionVar(mode) {
  if (mode === "cache") {
    var result = 7;
  } else if (mode === "network") {
    var result = 5;
  }
  return result;
}

function intentionalFunctionLet(mode) {
  let result;
  if (mode === "cache") {
    result = 7;
  } else if (mode === "network") {
    result = 5;
  }
  return result;
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
console.log(nestedWithoutShadowing());

try {
  shadowedConstBeforeDeclaration();
} catch (error) {
  console.log(error.name);
}

console.log(initializedShadowedConst());
console.log(intentionalFunctionVar("cache"), String(intentionalFunctionVar("none")));
console.log(intentionalFunctionLet("cache"), String(intentionalFunctionLet("none")));
