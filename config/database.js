const mongoose = require("mongoose");
const uri = require("./config").MongoURI;

module.exports = {
  start: function() {
    mongoose
    .connect(
        process.env.MONGODB_URI,
        {
          useNewUrlParser: true, useUnifiedTopology: true
        }
      )
      .then(console.log("MongoDB connected successfully"))
      .catch(err => console.log(err));
  },
  connection: mongoose.connection
};