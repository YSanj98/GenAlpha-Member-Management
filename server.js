const app = require("./app");
const mongoose = require("mongoose");
const path = require("path"); // Don't forget to require 'path'
const { sendPasswordResetOTPEmail } = require('../controller/userController.js'
);
require("config/.env");
//const { sendPasswordResetOTPEmail } = require ("./controller");



// Load environment variables from .env file
require("dotenv").config({ path: path.join(__dirname, "config", ".env") });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Handle database connection error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//pasword reset 
router.Post("/", async (req, res) => {
  try {
    const { email } =  req.body;
    if (!email) throw Error("An email is required.");

const createPasswordResetOTP = await
sendPasswordResetOTPEmail(email);
res.status(200).json(createPasswordResetOTP);

  } catch (Error) {
    res.status(400).send(error.massage);
  }
});


module.exports = router;