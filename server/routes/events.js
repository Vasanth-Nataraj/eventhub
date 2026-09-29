const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route   POST /api/events
// @desc    Create an event
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, date, capacity, tags } = req.body;

    const newEvent = new Event({
      title,
      description,
      organizerId: req.user.userId,
      date,
      capacity,
      tags,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/events/recommended
// @desc    Get ranked events based on user skills and interests
router.get("/recommended", auth, async (req, res) => {
  try {
    // 1. Fetch the logged-in user's data
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Combine skills and interests into one array for matching
    const userPreferences = [...user.skills, ...user.interests];

    // 2. The MongoDB Matching Pipeline
    const recommendedEvents = await Event.aggregate([
      {
        $match: { status: "upcoming" },
      },
      {
        $addFields: {
          matchScore: {
            $size: {
              $setIntersection: ["$tags", userPreferences],
            },
          },
        },
      },
      {
        // Only return events with at least 1 matching tag
        $match: { matchScore: { $gt: 0 } },
      },
      {
        // Sort by the highest match score first
        $sort: { matchScore: -1 },
      },
    ]);

    res.json(recommendedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
