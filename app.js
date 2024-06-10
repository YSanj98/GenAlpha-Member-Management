const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require('./utils/passport')
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");



const user = require("./controller/userController");
const settings = require("./controller/settingController");
const profile = require("./controller/userProfile");
const landing = require("./controller/landingPageController");
const mentor = require("./controller/mentorController");
const googleSign = require('./controller/googleSign')


const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") }); // Define the path to your .env file
}


app.use(
  cors({
    origin: process.env.CLIENT_URL_TEST,
    methods: "GET,POST,PUT,DELETE",
    credential: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.static("public/images"));
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["generationalpha"],
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/api", user);
app.use("/api", settings);
app.use("/api", profile);
app.use("/api", landing);
app.use("/api", mentor);
app.use("/auth", googleSign)

module.exports = app;
