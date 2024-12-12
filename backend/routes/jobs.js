// backend/routes/jobs.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Profile = require("../models/Profile");

// Get available jobs
router.get("/available", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId });
    if (!profile && req.user.role === "student") {
      return res.status(404).json({ message: "Profile not found" });
    }

    const query = { status: "open" };
    if (req.user.role === "student") {
      query["eligibility.departments"] = profile.department;
      query["eligibility.minCGPA"] = { $lte: profile.cgpa };
      query["eligibility.batch"] = profile.batch;
    }

    const jobs = await Job.find(query)
      .populate("createdBy", "company email")
      .sort("-createdAt");

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create new job
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      title,
      company,
      description,
      requirements,
      eligibility,
      salary,
      rounds,
    } = req.body;

    // Validation
    if (!title || !description || !eligibility) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = new Job({
      title,
      company,
      description,
      requirements,
      eligibility,
      salary,
      rounds,
      createdBy: req.user.userId,
      status: "open",
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update job status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    job.status = status;
    await job.save();
    res.json(job);
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
