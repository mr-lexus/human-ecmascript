function localSmi(flag) {
  let value = 42;
  if (flag) value += 1;
  return value;
}

function capturedSmi() {
  let value = 42;
  return function readSmi() {
    return value;
  };
}

function capturedSymbol() {
  const value = Symbol("token");
  return function readSymbol() {
    return value;
  };
}

console.log(localSmi(false));
console.log(capturedSmi()());
console.log(typeof capturedSymbol()());
