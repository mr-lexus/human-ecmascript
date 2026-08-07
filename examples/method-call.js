const obj = {
  name: "reference",
  method() {
    console.log(this === obj);
    console.log(this.name);
  },
};

obj.method();
