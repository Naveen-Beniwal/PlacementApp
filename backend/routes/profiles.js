// backend/routes/profiles.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const User = require("../models/User");

// Get current user's profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put("/", auth, async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      department,
      cgpa,
      batch,
      skills,
      education,
      experience,
      projects,
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.userId,
      name,
      rollNumber,
      department,
      cgpa,
      batch,
      projects,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()),
      education: education || [],
      experience: experience || [],
    };

    let profile = await Profile.findOne({ user: req.user.userId });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.userId },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload documents
router.post("/documents", auth, async (req, res) => {
  try {
    const { documentType, url } = req.body;
    const profile = await Profile.findOne({ user: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.documents.push({
      type: documentType,
      url,
      verified: false,
    });

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all profiles (admin only)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const profiles = await Profile.find()
      .populate("user", ["email", "role"])
      .sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get profile by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate("user", [
      "email",
      "role",
    ]);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update placement status
router.put("/placement-status", auth, async (req, res) => {
  try {
    const { placed, company, package } = req.body;
    const profile = await Profile.findOne({ user: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.placementStatus = {
      placed,
      company,
      package,
    };

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error("Error updating placement status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify documents (admin only)
router.put(
  "/verify-document/:profileId/:documentId",
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const document = profile.documents.id(req.params.documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      document.verified = true;
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error("Error verifying document:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
