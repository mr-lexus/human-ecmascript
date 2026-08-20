"use strict";

try {
  {
    console.log(value);
    let value = 1;
  }
} catch (error) {
  console.log(error.name);
}

function readVarBeforeAssignment() {
  console.log(value);
  var value = 1;
  return value;
}

readVarBeforeAssignment();
