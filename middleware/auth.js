const jwt = require("jsonwebtoken");

module.exports = function auth(permissions) {
  return function(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied, no token provided");
    try {
      let user = jwt.verify(token, process.env.JWTKEY);
      req.user = user;
      if (!permissions) {
        next();
      } else {
        if (!Array.isArray(permissions)) {
          res.status(500);
          res.send("Internal Server Errror: Permissions should be Array");
        } else {
          let hasPermission = true;
          permissions.forEach(element => {
            if (user.permissions.indexOf(element) < 0) {
              hasPermission = false;
            }
          });
          if (hasPermission || user.permissions.indexOf("001") > -1) {
            next();
          } else {
            res.status(401);
            res.send("Unauthorized");
          }
        }
      }
    } catch (ex) {
      res.status(400).send("invalid token");
    }
  };
};
