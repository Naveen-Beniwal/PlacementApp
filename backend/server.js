// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
const corsOptions = {
  origin: "https://placement-portal-seven.vercel.app",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
  res.header("Access-Control-Allow-Methods", corsOptions.methods);
  res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders);
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profiles", require("./routes/profiles"));
app.use("/api/jobs", require("./routes/jobs")); // Remove duplicate
app.use("/api/applications", require("./routes/applications"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server connected" });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
