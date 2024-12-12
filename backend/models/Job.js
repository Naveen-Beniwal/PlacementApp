// backend/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  requirements: [String],
  eligibility: {
    departments: [String],
    minCGPA: { type: Number, required: true },
    batch: { type: Number, required: true },
  },
  salary: {
    ctc: Number,
    breakup: String,
  },
  rounds: [
    {
      name: String,
      description: String,
      date: Date,
      venue: String,
    },
  ],
  numberOfPositions: Number,
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applicationDeadline: Date,
});

module.exports = mongoose.model("Job", jobSchema);
