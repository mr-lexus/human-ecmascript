"use strict";

const observation = {};

function PrimitiveReturningConstructor() {
  observation.candidateThis = this;
  this.kept = true;
  return 42;
}

const result = new PrimitiveReturningConstructor();

console.log(result === observation.candidateThis);
console.log(result.kept);
