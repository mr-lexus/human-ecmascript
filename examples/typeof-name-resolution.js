console.log(`missing:${typeof humanEcmascriptMissingTypeofName}`);
try {
  // eslint-disable-next-line no-undef -- Deliberately test failure during member-expression evaluation.
  console.log(typeof humanEcmascriptMissingTypeofName.property);
} catch (error) {
  console.log(`missing-member:${error.name}`);
}
{
  try {
    console.log(typeof value);
  } catch (error) {
    console.log(`tdz:${error.name}`);
  }
  // eslint-disable-next-line no-unassigned-vars -- The declaration initializes this binding to undefined.
  let value;
  console.log(`initialized:${typeof value}`);
}
