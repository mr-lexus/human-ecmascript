"use strict";

const observation = {};
const replacement = { source: "explicit return" };

function ReplacingConstructor() {
  observation.candidateThis = this;
  this.source = "candidate";
  return replacement;
}

const result = new ReplacingConstructor();

console.log(result === replacement);
console.log(result !== observation.candidateThis);
console.log(observation.candidateThis.source);
