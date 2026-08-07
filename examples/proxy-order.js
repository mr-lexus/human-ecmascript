const log = [];
const target = {
  method(value) {
    log.push(`call:${value}`);
  },
};
const obj = new Proxy(target, {
  get(targetObject, key, receiver) {
    log.push(`get:${String(key)}`);
    return Reflect.get(targetObject, key, receiver);
  },
});
function argument() {
  log.push("argument");
  return 7;
}

obj.method(argument());
console.log(log.join(" → "));
