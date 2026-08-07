const obj = {
  method() {
    "use strict";
    console.log(this === undefined);
  },
};

(0, obj.method)();
