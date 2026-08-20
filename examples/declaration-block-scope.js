"use strict";

function inspectScopes() {
  {
    var functionValue = "var survives the block";
    let blockValue = "let stays in the block";
    const fixedValue = "const stays in the block";
    console.log(`${blockValue} / ${fixedValue}`);
  }

  console.log(functionValue);
  try {
    // Intentionally demonstrate that the block binding is not in scope here.
    // eslint-disable-next-line no-undef
    console.log(blockValue);
  } catch (error) {
    console.log(error.name);
  }
}

inspectScopes();
