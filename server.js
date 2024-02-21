const app = require("./app");
const connectDb = require("./database/database");
require('dotenv').config();
const cloudinary = require('cloudinary').v2;


if (process.env.NODE_ENV == "production") {
  require("dotenv").config({ path: path.join(__dirname, "config", ".env") });
}

connectDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on ${process.env.PORT}`);

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