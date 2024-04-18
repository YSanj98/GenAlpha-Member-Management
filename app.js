const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");


const user = require("./controller/userController");
const settings = require("./controller/settingController");
const profile = require("./controller/userProfile");
const landing = require("./controller/landingPageController");
const mentor = require("./controller/mentorController");


const app = express();

app.use(
  cors(
    {
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credential: true,
    }
  )
);

app.use(express.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({ limit:'5mb',  extended: true }));
// app.use(express.static(path.join(__dirname, "public", "images")));
app.use(express.static('./public/images'));
app.use(cookieSession({ name: "session", maxAge: 24 * 60 * 60 * 1000, keys:["generationalpha"] }));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "config", ".env") }); // Define the path to your .env file
}

app.use("/api", user);
app.use("/api", settings);
app.use("/api", profile);
app.use("/api", landing);
app.use("/api", mentor);

module.exports = app;
