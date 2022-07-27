const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

let AmountSchema = new Schema({
  user: {
    type: String,
  },
  rate: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = model("Amount", AmountSchema);
