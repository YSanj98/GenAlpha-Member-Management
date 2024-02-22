const app = require("./app");
const connectDb = require("./database/database");

connectDb();

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on http://localhost:${process.env.PORT}`);
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
