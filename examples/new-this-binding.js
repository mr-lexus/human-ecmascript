"use strict";

const observation = {};

function Person(name) {
  observation.receivedThis = this;
  this.name = name;
}

const person = new Person("Ada");

console.log(observation.receivedThis === person);
console.log(Object.getPrototypeOf(person) === Person.prototype);
console.log(person.name);
