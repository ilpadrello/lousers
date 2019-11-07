const jsonFile = require("jsonfile");
const jwt = require("jsonwebtoken");
const userdbFile = "./databases/usersdb.json";
const jwtkey = process.env.JWTHASH;
let userdb;

let bridge = {
  async loadUserdb() {
    userdb = await jsonFile.readFile(userdbFile);
    for (var i = 0; i < userdb.length; i++) {
      let user = userdb[i];
      try {
        userdb[i] = jwt.verify(user, jwtkey);
      } catch (ex) {
        console.log("ERROR: Corrupted Database!!!");
        return false;
        //throw Error("The database has been corrupted!!!");
      }
    }
    return true;
  },
  async getUserByEmail(email) {
    if (!userdb) {
      if (!(await this.loadUserdb())) {
        console.log("Error While trying to load Userdb");
        return false;
      }
    }
    let userToReturn = false;
    userdb.forEach(user => {
      if (user.email == email) userToReturn = { ...user };
    });
    return userToReturn;
  },
  async getUserByUserName(userName) {
    if (!userdb) {
      if (!(await this.loadUserdb())) {
        return false;
      }
    }
    let userToReturn = false;
    userdb.forEach(user => {
      if (user.userName == userName) userToReturn = { ...user };
    });
    return userToReturn;
  },
  async getUserByID(id) {
    if (!userdb) {
      if (!(await this.loadUserdb())) {
        return false;
      }
    }
    let userToReturn = false;
    userdb.forEach(user => {
      if (user.id == id) userToReturn = { ...user };
    });
    return userToReturn;
  },
  async putNewUser(newUser) {
    try {
      jwtUserdb = await jsonFile.readFile(userdbFile);
      newUser = jwt.sign(newUser, process.env.JWTHASH);
      jwtUserdb.push(newUser);
      await jsonFile.writeFile(userdbFile, jwtUserdb);
      await this.loadUserdb();
      return true;
    } catch (e) {
      return new Error("impossible to Add new User", e);
    }
  },
  async logUsers() {
    if (!userdb) {
      if (!(await this.loadUserdb())) {
        return false;
      }
    }
    console.log(userdb);
    return true;
  }
};

module.exports = bridge;
