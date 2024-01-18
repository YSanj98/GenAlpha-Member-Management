const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const user = require("./controller/userController");
const settings = require("./controller/settingController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "static")));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "config", ".env") }); // Define the path to your .env file
}

app.use("/api", user);
app.use("/api", settings);



module.exports = app;
