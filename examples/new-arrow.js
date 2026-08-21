"use strict";

const arrow = () => {};

try {
  new arrow();
} catch (error) {
  console.log(error.name);
}
