// backend/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "selected", "rejected"],
    default: "applied",
  },
  roundStatus: [
    {
      round: String,
      status: String,
      feedback: String,
      date: Date,
    },
  ],
  documents: [
    {
      type: String,
      url: String,
      verified: Boolean,
    },
  ],
  feedback: String,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on status change
applicationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Application", applicationSchema);
