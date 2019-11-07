uuidgen = require("../personal_modules/objectIdgen");
test("testing uuidgen", () => {
  let result = uuidgen();
  console.log(result);
  console.log(result.length);
  expect(result).not.toBeNull();
});
