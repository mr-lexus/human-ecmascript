"use strict";

const text = "cat";
try {
  text[0] = "b";
} catch (error) {
  console.log(error.name);
}

console.log(text);
