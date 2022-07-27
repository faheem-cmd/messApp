const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const Amount = require("../models/amount.models");
// const user = require("../services/user.service");
const argon = require("argon2");

const signup = async (req, res) => {
  const password = await argon.hash(req.body.password);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    } else if (!validateEmail(req.body.email)) {
      return res.status(404).json({ message: "Please enter valid email" });
    } else {
      const name = req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
      const amount = req.body.amount;
      // const password = req.body.password;
      let user = new User({
        name,
        email,
        phone,
        amount,
        password,
      });
      user
        .save()
        .then((data) => {
          console.log(data);
          // const newData = {name:data.name,email:data.email,phone:data.phone,data}
          res.status(201).json({ message: "Created", data });
        })
        .catch((e) => res.status(500).json({ error: e }));
    }
  });
};

const checkPswd = async (password, passwordHash) => {
  const pwMatches = await argon.verify(password, passwordHash);
  return pwMatches;
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const filter = { email: email };
  User.find(filter).then(async (result) => {
    if (result.length == 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Incorrect email" });
    } else {
      const user = result[0];
      const user_data = {
        user_id: result[0]._id,
      };
      let check = await checkPswd(user.password, password);
      if (email !== user.email) {
        return res.status(404).json({ message: "Incorrect email" });
      }
      if (!check) {
        return res.status(404).json({ message: "Incorrect password" });
      }
      let accessToken = jwt.sign({ user_data }, "access-key-secrete", {
        expiresIn: "2d",
      });
      // let refreshToken = jwt.sign({ user }, "refresh-key-secrete", {
      //   expiresIn: "7d",
      // });

      const update = {
        access_token: accessToken,
        //refresh_token: refreshToken,
      };

      User.findOneAndUpdate(filter, update, { new: true }).then((result) => {});

      const tokens = {
        accessToken,
        // refreshToken,
      };
      return res.status(200).json({
        status: "success",
        data: tokens,
        message: "Logged in successfully",
      });
    }
  });
};

const logout = async (req, res) => {
  const user_id = req.user.user_data.user_id;
  const email = req.body.email;
  const filter = { _id: user_id };
  User.find(filter).then((result) => {
    const user = result[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const update = {
      access_token: "",
      // refresh_token: "",
    };
    User.findOneAndUpdate(filter, update, { new: true }).then((result) => {});

    return res.status(200).json({ message: "User logged out successfully" });
  });
};

function getByUserId(req, res) {
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function addAmount(req, res, next) {
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    const newAmount = { amount: data.amount + req.body.amount };
    history(user_id, req.body.amount, req.body.date);
    User.findByIdAndUpdate(user_id, newAmount, (err, emp) => {
      if (err) {
        return res
          .status(500)
          .send({ error: "Problem with Updating the   Employee recored " });
      }
      res.send({ success: "Updation successfull" });
    });
  });
}

function history(user, rate, date) {
  let amount = new Amount({
    user,
    rate,
    date,
  });
  amount.save().then((data) => {
    // res.status(200).json({ status: "success", data: data });
    console.log(data);
  });
}

function getAll(req, res, next) {
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function getByAmt(req, res) {
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    if (data[0].user == user_id) {
      const newData = data.filter((item) => item.date == req.body.date);
      res
        .status(200)
        .json({ status: "success", message: "available", data: newData });
    } else {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
  });
}

const filterByDate = (req, res) => {
  console.log(req.body);
  let user_id = req.user.user_data.user_id;
  Amount.find({ user: user_id }).then((data) => {
    if (data[0].user == user_id) {
      var startDate = new Date(req.body.start_date);
      var endDate = new Date(req.body.end_date);

      var resultProductData = data.filter((a) => {
        var date = new Date(a.date);
        return date >= startDate && date <= endDate;
      });
      console.log(resultProductData, "jjdjd");

      res.status(200).json({
        status: "success",
        message: "available",
        data: resultProductData,
      });
    } else {
      return res
        .status(200)
        .json({ status: "success", message: "No data found" });
    }
  });
};

module.exports = {
  signup,
  login,
  logout,
  getByUserId,
  addAmount,
  getAll,
  getByAmt,
  filterByDate,
};
