// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://placement-portal-seven.vercel.app",
      "http://localhost:3000", // for local development
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/placement-portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profiles", require("./routes/profiles"));
app.use("/api/jobs", require("./routes/jobs")); // Remove duplicate
app.use("/api/applications", require("./routes/applications"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Authentication Error",
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server connected" });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Performing graceful shutdown...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});
