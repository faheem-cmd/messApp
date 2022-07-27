const express = require("express");
var router = express();
const bodyparser = require("body-parser");
router.use(bodyparser.json());
const auth = require("../middleware/user.middleware");

const user = require("../controller/user.controller");
const meals = require("../controller/meals.controller");

router.get("/", (req, res) => {
  res.send("hello");
});
router.post("/signup", user.signup);
router.post("/login/", user.login);
router.post("/logout", auth.accessToken, user.logout);
router.get("/profile", auth.accessToken, user.getByUserId);

router.post("/meals", meals.create);
router.get("/meals", meals.view);
router.get("/meals/:id", meals.getById);
router.put("/amount", auth.accessToken, user.addAmount);

router.get("/all", auth.accessToken, user.getAll);
router.get("/am", auth.accessToken, user.getByAmt);
router.post("/filter", auth.accessToken, user.filterByDate);

module.exports = router;
