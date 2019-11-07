const rolesBridge = require("../personal_modules/bridges/pg/rolesDBBridge");

test("testing gettingRoleById()", async () => {
  let result = await rolesBridge.loadRoles();
});

// test("testing createRoles() method", async () => {
//   await rolesBridge.createRoles();
// });
