const obj = {
  get method() {
    return function () {
      console.log(this === obj);
    };
  },
};

obj.method();
