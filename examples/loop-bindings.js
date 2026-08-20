"use strict";

const letReaders = [];
for (let index = 0; index < 3; index += 1) {
  letReaders.push(() => index);
}

const varReaders = [];
for (var index = 0; index < 3; index += 1) {
  varReaders.push(() => index);
}

console.log(letReaders.map((read) => read()).join(","));
console.log(varReaders.map((read) => read()).join(","));
