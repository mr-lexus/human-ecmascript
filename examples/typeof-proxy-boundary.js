let applyTraps = 0;
const { proxy, revoke } = Proxy.revocable(function target() {}, {
  apply() {
    applyTraps += 1;
  },
});
console.log(`callable:${typeof proxy}`);
console.log(`apply-traps:${applyTraps}`);
console.log(`noncallable:${typeof new Proxy({}, {})}`);
revoke();
console.log(`revoked:${typeof proxy}`);
try {
  proxy();
} catch (error) {
  console.log(`revoked-call:${error.name}`);
}
