const mongoose = require("mongoose");

// Database Connection Singleton Pattern
let dbConnection = null;

const connectionDb = async () => {
  try {
    if (!dbConnection) {
      dbConnection = await mongoose.connect(process.env.DB_URL);
      console.log("MongoDB connected");
    }
    return dbConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectionDb;
