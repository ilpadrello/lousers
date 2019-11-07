const express = require("express");
const router = express.Router();
//const userBridge = require("../personal_modules/bridges/pg/userDBBridge");
const roleBridge = require("../personal_modules/bridges/pg/rolesDBBridge");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWTKEY;
const auth = require("../middleware/auth");
const pash = require("password-hash");
const joi = require("@hapi/joi");
const bodyParser = require("body-parser");
const ObjectId = require("../personal_modules/objectIdgen");
let joiUserObj = require("../schemas/user");
joiUserObj = joiUserObj.keys({
  password: joi.string().required()
});

router.use(bodyParser.json());
router.post("/new-user", auth(), async (req, res) => {
  try {
    if (!req.body.newUser) {
      res.status(400);
      return res.send(
        "Expecting literal Object called newUser with the new user infos"
      );
    } else {
      let newUser = req.body.newUser;
      const { error, value } = joiUserObj.validate(newUser);
      if (error) {
        res.status(400);
        res.send(error.message);
      } else {
        let user = req.user;
        if (!user.role.users.create) {
          res.status(401);
          res.send("You can not create new Users");
        } else {
          if (user.role.users.create.indexOf("all") > -1) {
            let result = await createRoleNewUser(newUser);
            if (result) {
              res.status(302);
              res.json(result);
            }
          } else {
            res.status(302);
            res.send("ocaca");
          }
        }
      }
    }
  } catch (ex) {
    next(ex);
  }
});

router.post("/login", async (req, res) => {
  //console.log(req.params);
  console.log(req.body);
  //console.log(req.query);
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.sendStatus(400);
  } else {
    let user = await userBridge.getUserByEmail(email);
    //console.log(user);
    if (!user || !pash.verify(password, user.password)) {
      res.sendStatus(401);
    } else {
      delete user.password;
      let token = jwt.sign(user, jwtKey);
      res.status(200);
      res.header("Content-Type", "text/html");
      res.json({ jwt: token });
    }
  }
});

router.post("/test-jwt", auth(), async (req, res) => {
  //console.log(req.user);
  //console.log(new Date(req.user.iat));
  res.sendStatus(200);
});

router.get("/log", auth(), async (req, res) => {
  if (await userBridge.logUsers()) {
    res.status(200);
    res.send("Users Printed");
  } else {
    res.status("500");
    res.send("Something goes wrong");
  }
});

router.post("/jwt-user", (req, res) => {
  let user = req.body.user;
  res.send(jwt.sign(user, process.env.JWTHASH));
});

router.post("/jwt-token", (req, res) => {
  let user = req.body.user;
  res.send(jwt.sign(user, process.env.jwtKey));
});

function createNewUser(newUser) {
  return true;
}
async function createRoleNewUser(newUser) {
  console.log("test", test, test1);
  let roleRef = await roleBridge.getRoleByName(newUser.role.name);
  if (roleRef) {
    console.log("rolRef ->", roleRef);
    let toReturn = roleRef;
    console.log("toReturn Prima->", toReturn);
    //toReturn = JSON.parse(JSON.stringify(roleRef));

    let allowedExceptions = toReturn.exceptions;
    delete toReturn.exceptions;
    console.log("allowed ->", allowedExceptions);
    let askedExceptions = { ...newUser.role.exceptions };
    console.log("asked ->", askedExceptions);
    console.log("toReturn ->", toReturn);
    for (var resource in askedExceptions) {
      for (var action in askedExceptions[resource]) {
        console.log(toReturn[resource][action]);
        let toInsert = askedExceptions[resource][action].filter(elem => {
          return allowedExceptions[resource][action].indexOf(elem) >= 0;
        });
        if (toInsert.length > 0) {
          if (!toReturn[resource].hasOwnProperty(action)) {
            toReturn[resource][action] = new Array();
          }
          toReturn[resource][action] = toReturn[resource][action].concat(
            toInsert
          );
        }
      }
    }
    //console.log(toReturn);
    return toReturn;
  } else {
    return false;
  }
}
module.exports = router;
