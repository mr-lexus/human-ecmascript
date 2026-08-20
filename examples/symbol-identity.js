const first = Symbol("token");
const second = Symbol("token");
const record = { [first]: "first", [second]: "second" };

console.log(first === second);
console.log(Reflect.ownKeys(record).length);
