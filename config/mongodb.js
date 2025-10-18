require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB connection URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ShoxEz-ai";

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    console.log("MongoDB connected successfully for AI predictions");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("AI predictions will use in-memory storage");
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});

module.exports = { connectMongoDB, mongoose };
