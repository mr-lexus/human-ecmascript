function F() {}
const arrow = () => {};
class C {}
class Explicit {
  constructor() {}
}
console.log(`regular-type:${typeof F}`);
console.log(`arrow-type:${typeof arrow}`);
console.log(`class-type:${typeof C}`);
console.log(`explicit-class-type:${typeof Explicit}`);
for (const [label, action] of [
  ["regular-call", () => F()],
  ["regular-new", () => new F()],
  ["arrow-call", () => arrow()],
  ["arrow-new", () => new arrow()],
  ["class-call", () => C()],
  ["class-new", () => new C()],
  ["explicit-class-call", () => Explicit()],
  ["explicit-class-new", () => new Explicit()],
]) {
  try {
    action();
    console.log(`${label}:ok`);
  } catch (error) {
    console.log(`${label}:${error.name}`);
  }
}
