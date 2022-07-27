const Meals = require("../models/meals.models");

function create(req, res, next) {
  let name = req.body.name;
  let rate = req.body.rate;

  let meals = new Meals({
    name,
    rate,
  });
  meals.save().then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function view(req, res, next) {
  Meals.find({}).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

function getById(req, res) {
  Meals.findById(req.params.id).then((data) => {
    res.status(200).json({ status: "success", data: data });
  });
}

module.exports = { create, view, getById };
