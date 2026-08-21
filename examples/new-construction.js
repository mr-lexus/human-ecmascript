"use strict";

function Person(name) {
  this.name = name;
}

const person = new Person("Ada");
console.log(person.name);
console.log(Object.getPrototypeOf(person) === Person.prototype);

const replacement = { source: "explicit return" };
function ReplacingConstructor() {
  this.source = "discarded this";
  return replacement;
}

console.log(new ReplacingConstructor() === replacement);

function PrimitiveReturningConstructor() {
  this.candidateWasKept = true;
  return 42;
}

console.log(new PrimitiveReturningConstructor().candidateWasKept);

const existing = { source: "proxy trap" };
const ProxyConstructor = new Proxy(function target() {}, {
  construct() {
    return existing;
  },
});

console.log(new ProxyConstructor() === existing);

const arrow = () => {};
try {
  new arrow();
} catch (error) {
  console.log(error.name);
}
