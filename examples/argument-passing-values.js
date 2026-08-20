function replace(value) {
  value = { count: 100 };
  return value;
}

function mutate(value) {
  value.count += 1;
}

const state = { count: 1 };
replace(state);
console.log(state.count);

mutate(state);
console.log(state.count);
