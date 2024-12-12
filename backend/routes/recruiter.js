// backend/routes/recruiter.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Profile = require("../models/Profile");
const User = require("../models/User");
// Get recruiter's applications
// backend/routes/recruiter.js
// Update the applications route
// router.get("/applications", auth, async (req, res) => {
//   try {
//     const recruiterJobs = await Job.find({ createdBy: req.user.userId });
//     const jobIds = recruiterJobs.map((job) => job._id);

//     const applications = await Application.find({
//       job: { $in: jobIds },
//     })
//       .populate({
//         path: "student",
//         select: "email",
//         populate: {
//           path: "profile",
//           model: "Profile",
//           select:
//             "name rollNumber department cgpa skills batch education experience",
//         },
//       })
//       .populate({
//         path: "job",
//         select: "title company status requirements",
//       })
//       .sort("-createdAt");

//     console.log("Applications with student details:", applications); // Debug log
//     res.json(applications);
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// backend/routes/recruiter.js
// backend/routes/recruiter.js
// backend/routes/recruiter.js - Update applications route
router.get("/applications", auth, async (req, res) => {
  try {
    const recruiterJobs = await Job.find({ createdBy: req.user.userId });
    const jobIds = recruiterJobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({
        path: "student",
        model: "User",
        populate: {
          path: "profile",
        },
      })
      .populate("job")
      .lean();

    console.log("Debug - Applications:", JSON.stringify(applications, null, 2));

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/stats", auth, async (req, res) => {
  try {
    const recruiterJobs = await Job.find({ createdBy: req.user.userId });
    const jobIds = recruiterJobs.map((job) => job._id);

    const stats = {
      totalJobs: await Job.countDocuments({ createdBy: req.user.userId }),
      activeJobs: await Job.countDocuments({
        createdBy: req.user.userId,
        status: "open",
      }),
      totalApplications: await Application.countDocuments({
        job: { $in: jobIds },
      }),
      applicationsByStatus: {
        applied: await Application.countDocuments({
          job: { $in: jobIds },
          status: "applied",
        }),
        shortlisted: await Application.countDocuments({
          job: { $in: jobIds },
          status: "shortlisted",
        }),
        selected: await Application.countDocuments({
          job: { $in: jobIds },
          status: "selected",
        }),
        rejected: await Application.countDocuments({
          job: { $in: jobIds },
          status: "rejected",
        }),
      },
      recentActivity: await Application.find({ job: { $in: jobIds } })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("student", "email")
        .populate("job", "title"),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching recruiter stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// backend/routes/recruiter.js
// backend/routes/recruiter.js
router.post("/jobs", auth, async (req, res) => {
  try {
    console.log("Received job data:", req.body);

    // Get recruiter's company
    const recruiter = await User.findById(req.user.userId);
    if (!recruiter || !recruiter.company) {
      return res.status(400).json({ message: "Recruiter company not found" });
    }

    const job = new Job({
      title: req.body.title,
      company: recruiter.company,
      description: req.body.description,
      requirements: req.body.requirements,
      eligibility: {
        departments: req.body.eligibility.departments,
        minCGPA: parseFloat(req.body.eligibility.minCGPA),
        batch: parseInt(req.body.eligibility.batch),
      },
      numberOfPositions: parseInt(req.body.numberOfPositions),
      applicationDeadline: req.body.applicationDeadline,
      createdBy: req.user.userId,
      status: "open",
      ...(req.body.salary && { salary: req.body.salary }),
      ...(req.body.rounds && { rounds: req.body.rounds }),
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({
      error: error.message,
      details: error.errors,
    });
  }
});
// Add status update endpoint
router.put("/applications/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    if (!["applied", "shortlisted", "selected", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

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
    application.roundStatus.push({
      round: status,
      status: "completed",
      date: new Date(),
    });

    await application.save();

    res.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
