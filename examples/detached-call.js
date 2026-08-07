const obj = {
  method() {
    "use strict";
    console.log(this === undefined);
  },
};

const detached = obj.method;
detached();
