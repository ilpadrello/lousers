const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "kinessa",
  port: 5432
});

async function dbConnect() {
  try {
    await client.connect();
  } catch (ex) {
    console.log("DB CONNECTION ERROR: ", ex);
  }
}
async function dbDisconnect() {
  try {
    await client.end();
  } catch (ex) {
    console.log("Error trying to disconnect the DATABASE", ex);
  }
}

async function dbQuery(query) {
  try {
    return await client.query(query);
  } catch (ex) {
    console.log("ERROR QUERYING THE DB: Query:", query, "Error:", ex);
  }
}

async function loadRoles() {
  try {
    let { rows: roles } = await dbQuery({
      text: "SELECT * FROM roles"
    });
    roles.forEach(role => {});
  } catch (ex) {}
}

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

dbConnect();

module.exports = {
  async loadRoles() {
    return await loadRoles();
  },
  async getRoleById(rolelevel) {
    let result = await dbQuery({
      text: "SELECT * FROM roles WHERE level=$1",
      values: [rolelevel]
    }).row[0];
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
  }
};
