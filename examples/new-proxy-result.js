"use strict";

const existing = { source: "proxy trap" };
const ProxyConstructor = new Proxy(function target() {}, {
  construct() {
    return existing;
  },
});

console.log(new ProxyConstructor() === existing);
