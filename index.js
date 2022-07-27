const express = require("express");
var mongoose = require("./services/mongoose");
var app = express();
require("dotenv").config();
const router = require("./routes/user.router");
const { success, error } = require("consola");
app.use("/", router);
//MongoDB connection
const dbName = "mess";
const dbUrl = process.env.DB_URL || `mongodb://0.0.0.0:27017/${dbName}`;
mongoose(dbUrl);
// mongoose.connect("mongodb://localhost/mess", { useNewUrlParser: true });
// mongoose.connection
//   .once("open", function () {
//     console.log("Database connected Successfully");
//   })
//   .on("error", function (err) {
//     console.log("Error", err);
//   });
//Server
app.listen(process.env.PORT, () => {
  success({
    message: `Successfully connected with the database \n${dbUrl}`,
    badge: true,
  });

  success({
    message: `Server is running on \n${process.env.PORT}`,
    badge: true,
  });
});
