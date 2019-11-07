require("dotenv").config();
const express = require("express");
require("express-async-errors");
const app = express(3000);
const error = require("./middleware/error");
const users = require("./routes/users");
const pash = require("password-hash");
app.use("/users", users);
app.use(express.static("public"));

//THIS CODE WILL CATCH ALL THE EXCEPTIONS THAT ARE NOT CATCHED IN THE CODE
//THIS WILL STOP THE EXECUTION OF THE PROCESS, BUT AT LEAST YOU CAN LOG IT!
//WILL IT WORK FOR REQUIRED OBJ?
process.on("uncaughtException", ex => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION!!!", ex.message);
});
//This middleware is used for handling errors, and for this reason this code must be the last use!
app.use(error);

app.get("/auth/connection/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  res.send(id);
  //res.status(404).send("File not found");
});

app.get("/auth/query/", (req, res) => {
  let test = req.query.test;
  console.log(test);
  if (test != undefined) {
    res.send(test);
  } else {
    res.status(500).send("ERROR");
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
