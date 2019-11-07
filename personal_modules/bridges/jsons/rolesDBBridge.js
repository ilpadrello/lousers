const jsonFile = require("jsonfile");
const jwt = require("jsonwebtoken");
const file = "./config/roles.json";
const jwtkey = process.env.JWTHASH;
let roles = {};

module.exports = {
  copy(json) {
    return JSON.parse(JSON.stringify(json));
  },
  async createRoles() {
    try {
      var rolesFile = await jsonFile.readFile(file);
    } catch (ex) {
      console.log(ex);
    }
    let getExendedValues = function(role, id) {
      //console.log("getExtendedValues(" + role.id + " " + id + ")");
      for (let i = 0; i < rolesFile.length; i++) {
        let extRole = rolesFile[i];
        if (extRole.id == id) {
          //console.log(id, newRole.id, newRole.extends);
          if (extRole.extends != false) {
            for (let i = 0; i < extRole.extends.length; i++) {
              extRole = getExendedValues(extRole, extRole.extends[i]);
              return mergeObj(extRole, role);
            }
          } else {
            return mergeObj(extRole, role);
          }
        }
      }
      return false;
    };
    let mergeObj = function(obj1, obj2) {
      var obj = { ...obj1 };
      for (var x in obj2) {
        if (obj.hasOwnProperty(x)) {
          if (typeof obj2[x] == "object") {
            if (Array.isArray(obj2[x]) && Array.isArray(obj[x])) {
              obj[x] = obj2[x].concat(obj[x]);
              let temp = obj[x].filter((item, index) => {
                return obj[x].indexOf(item) == index;
              });
              obj[x] = temp;
            } else {
              obj[x] = mergeObj(obj[x], obj2[x]);
            }
          } else {
            //console.log("mergeObj..." + x + " " + obj2[x] + "=>" + obj[x]);
            obj[x] = obj2[x];
          }
        } else {
          //console.log("mergeObj..." + x + " nothing => " + obj2[x]);
          obj[x] = obj2[x];
        }
      }
      return obj;
    };
    rolesFile.forEach(role => {
      if (role.extends !== false) {
        role.extends.forEach(id => {
          role = getExendedValues(role, id);
          //console.log(role);
        });
      }
      roles[role.name] = role;
    });
    await jsonFile.writeFile("allperms.json", roles);
    return true;
  },
  async getRoleByName(roleName) {
    if (Object.entries(roles).length === 0 && roles.constructor === Object) {
      await this.createRoles();
    }
    if (roles.hasOwnProperty(roleName)) {
      return this.copy(roles[roleName]);
    } else {
      //console.log("there is no property");
      return false;
    }
  },
  async getRoleById(id) {
    if (Object.entries(roles).length === 0 && roles.constructor === Object) {
      await this.createRoles();
    }
    for (var role in roles) {
      if (role.id == id) return this.copy(role);
    }
    return false;
  }
};
