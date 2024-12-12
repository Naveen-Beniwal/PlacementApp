// backend/routes/applications.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Profile = require("../models/Profile");

// Get user's applications
router.get("/my", auth, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.userId })
      .populate({
        path: "job",
        select: "company title status requirements",
        populate: {
          path: "createdBy",
          select: "company email",
        },
      })
      .sort("-appliedAt");

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
});

// Apply for a job
router.post("/", auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user.userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Check job eligibility
    const [job, profile] = await Promise.all([
      Job.findById(jobId),
      Profile.findOne({ user: req.user.userId }),
    ]);

    if (!job || job.status !== "open") {
      return res.status(400).json({ message: "Job not available" });
    }

    // Verify eligibility
    const isEligible =
      job.eligibility.departments.includes(profile.department) &&
      (!job.eligibility.minCGPA || job.eligibility.minCGPA <= profile.cgpa) &&
      job.eligibility.batch === profile.batch;

    if (!isEligible) {
      return res.status(400).json({ message: "Not eligible for this job" });
    }

    // Create application
    const application = new Application({
      student: req.user.userId,
      job: jobId,
      status: "applied",
      roundStatus: [
        {
          round: "Initial Application",
          status: "pending",
          date: new Date(),
        },
      ],
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update application status (recruiter only)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findById(req.params.id).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify recruiter owns the job
    if (application.job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    if (feedback) {
      application.roundStatus.push({
        round: status,
        status: "completed",
        feedback,
        date: new Date(),
      });
    }

    await application.save();
    res.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get application details
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "student",
        select: "-password",
        populate: {
          path: "profile",
        },
      })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "company email",
        },
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify access rights
    if (
      req.user.role !== "admin" &&
      application.student._id.toString() !== req.user.userId &&
      application.job.createdBy._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
