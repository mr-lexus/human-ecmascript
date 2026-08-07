const obj = { value: 42 };

try {
  obj.value();
} catch (error) {
  console.log(error.name);
}
