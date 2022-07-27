const mongoose = require("mongoose");

module.exports = (url) => {
  const cb = () => {};
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.Promise = global.Promise;
  mongoose.connect(url, options, cb);
  return mongoose;
};
