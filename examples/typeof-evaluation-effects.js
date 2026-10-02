let reads = 0;
const source = {
  get value() {
    reads += 1;
    return 1;
  },
};
console.log(`getter-result:${typeof source.value}`);
console.log(`getter-reads:${reads}`);
let calls = 0;
function makeValue() {
  calls += 1;
  return {};
}
console.log(`call-result:${typeof makeValue()}`);
console.log(`calls:${calls}`);
