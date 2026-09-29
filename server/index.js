// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Initialize connection
connectDB();

// Basic test route
app.get("/", (req, res) => {
  res.send("EventHub API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Import Models
// Import Models
const User = require("./models/User");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const TagsMaster = require("./models/TagsMaster"); // Update this if it is still Tags_master.js

console.log("All Mongoose models loaded successfully.");

console.log("All Mongoose models loaded successfully.");
