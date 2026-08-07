const log = [];
const key = {
  toString() {
    log.push("key");
    return "method";
  },
};
const obj = {
  method() {
    log.push("call");
  },
};

obj[key]();
console.log(log.join(" → "));
