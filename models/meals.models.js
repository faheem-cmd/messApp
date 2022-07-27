const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

let MealsSchema = new Schema({
  name: {
    type: String,
  },
  rate: {
    type: String,
  },
});

module.exports = model("Meals", MealsSchema);
