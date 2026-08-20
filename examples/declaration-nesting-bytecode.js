"use strict";

function nestedLetRead(flag) {
  let value = 7;
  for (let index = 0; index < 3; index += 1) {
    if (flag) {
      if (index === 2) return value;
    }
  }
  return value;
}

function nestedVarRead(flag) {
  var value = 7;
  for (let index = 0; index < 3; index += 1) {
    if (flag) {
      if (index === 2) return value;
    }
  }
  return value;
}

function makeCapturedLet() {
  let value = 7;
  return function readCapturedLet() {
    return value;
  };
}

function makeCapturedVar() {
  var value = 7;
  return function readCapturedVar() {
    return value;
  };
}

function capturedLoopLet() {
  const readers = [];
  for (let index = 0; index < 3; index += 1) {
    readers.push(function readLoopLet() {
      return index;
    });
  }
  return readers.map((read) => read()).join(",");
}

function capturedLoopVar() {
  const readers = [];
  for (var index = 0; index < 3; index += 1) {
    readers.push(function readLoopVar() {
      return index;
    });
  }
  return readers.map((read) => read()).join(",");
}

console.log(nestedLetRead(true), nestedVarRead(true));
console.log(makeCapturedLet()(), makeCapturedVar()());
console.log(capturedLoopLet());
console.log(capturedLoopVar());
