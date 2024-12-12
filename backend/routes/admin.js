// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Profile = require("../models/Profile");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }
  next();
};

// Get admin dashboard stats
router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const stats = {
      totalStudents: await User.countDocuments({ role: "student" }),
      totalRecruiters: await User.countDocuments({ role: "recruiter" }),
      totalJobs: await Job.countDocuments(),
      totalApplications: await Application.countDocuments(),
      selectedStudents: await Application.countDocuments({
        status: "selected",
      }),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get("/students", auth, isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .populate("profile")
      .select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all jobs
router.get("/jobs", auth, isAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "email company");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications
router.get("/applications", auth, isAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "student",
        populate: {
          path: "profile",
        },
      })
      .populate({
        path: "job",
        populate: {
          path: "createdBy",
          select: "email company",
        },
      });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// backend/routes/admin.js
router.get("/stats/detailed", auth, isAdmin, async (req, res) => {
  try {
    // Get department-wise stats
    const departmentStats = await Application.aggregate([
      { $match: { status: "selected" } },
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "student.profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $group: {
          _id: "$profile.department",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get monthly trends
    const monthlyStats = await Application.aggregate([
      { $match: { status: "selected" } },
      {
        $group: {
          _id: {
            month: { $month: "$updatedAt" },
            year: { $year: "$updatedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      departmentStats: departmentStats.reduce((acc, curr) => {
        acc[curr._id[0]] = curr.count;
        return acc;
      }, {}),
      statusStats: {
        selected: await Application.countDocuments({ status: "selected" }),
        pending: await Application.countDocuments({
          status: { $in: ["applied", "shortlisted"] },
        }),
        rejected: await Application.countDocuments({ status: "rejected" }),
      },
      monthlyStats: {
        labels: monthlyStats.map(
          (stat) => `${stat._id.month}/${stat._id.year}`
        ),
        data: monthlyStats.map((stat) => stat.count),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
