const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const routes = require("./server");
//const routes = require('./routes');

const user = require("./controller/userController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "static")));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "config", ".env") }); // Define the path to your .env file
}

app.use("/api", user);

module.exports = app;
module.exports = routes;
//hi