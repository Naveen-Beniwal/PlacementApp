// backend/models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "admin", "recruiter"],
    required: true,
  },
  verified: { type: Boolean, default: false },
  company: {
    type: String,
    required: function () {
      return this.role === "recruiter";
    },
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: function () {
      return this.role === "student";
    },
  },
  lastLogin: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
module.exports = mongoose.model("User", userSchema);
