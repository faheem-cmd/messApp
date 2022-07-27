const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
// require("dotenv").config();

const accessToken = async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1]; //Access token
  let filter = { access_token: token };

  User.find(filter).then((result) => {
    const user = result[0];
    if (!user) {
      return res
        .status(403)
        .json({ status: "error", message: "Unauthenticated" });
    }
    jwt.verify(token, "access-key-secrete", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res
          .status(403)
          .json({ status: "error", message: "Unauthenticated" });
      }
    });
  });
};

module.exports = {
  accessToken,
};
