const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const mongooseSetup = require("./config/database");

const index = require("./routes/index");
const users = require("./routes/users");

//Passport Config
require("./config/passport")(passport);


// mongoose.connect(
//   process.env.MONGODB_URI || config.MongoURI,
//   {
//     useMongoClient: true, useNewUrlParser: true, useUnifiedTopology: true
//   }
// );

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //alows us to deal with form data and json data

//Express session middleware
app.use(
    session({
      name: "sid",
      resave: false,
      saveUninitialized: false,
      secret: "secret",
      store: new MongoStore({ mongooseConnection: mongooseSetup.connection }),
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
      }
    })
  );

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Globals
app.use((req, res, next) => {
    if (req.session) {
      res.locals.session = req.session;
    }
    next();
  });

//Routes
app.use("/", index);
app.use("/users", users);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

const PORT = process.env.PORT || 3001;
app.listen(PORT);