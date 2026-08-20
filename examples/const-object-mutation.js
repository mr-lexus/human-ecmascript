"use strict";

const settings = { retries: 0 };
settings.retries += 1;
console.log(settings.retries);

try {
  // Intentionally demonstrate assignment to an immutable binding.
  // eslint-disable-next-line no-const-assign
  settings = { retries: 2 };
} catch (error) {
  console.log(error.name);
}
