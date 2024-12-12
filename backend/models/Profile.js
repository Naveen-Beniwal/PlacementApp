// testing
// backend/models/Profile.js
const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  type: String,
  url: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  links: [linkSchema],
});

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  batch: { type: Number, required: true },
  skills: [String],
  education: [
    {
      institution: String,
      degree: String,
      year: Number,
      score: String,
    },
  ],
  experience: [
    {
      title: String,
      company: String,
      duration: String,
      description: String,
    },
  ],
  projects: [projectSchema],
});

module.exports = mongoose.model("Profile", profileSchema);
