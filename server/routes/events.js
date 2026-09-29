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
// @desc    Get events ranked by skill match score using dynamic query or user profile
router.get('/recommended', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use skills passed from the client selector, or fallback to saved profile skills
    let targetSkills = user.skills || [];
    if (req.query.skills) {
      targetSkills = req.query.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const matchedEvents = await Event.aggregate([
      { $match: { status: 'upcoming' } },
      {
        $addFields: {
          matchedSkills: {
            $setIntersection: ['$tags', targetSkills]
          }
        }
      },
      {
        $addFields: {
          matchScore: { $size: '$matchedSkills' }
        }
      },
      // STRICT FILTER: Only show events that have at least 1 matching skill
      { $match: { matchScore: { $gt: 0 } } },
      // Sort strictly by highest overlap first, then by date
      { $sort: { matchScore: -1, date: 1 } }
    ]);

    res.json(matchedEvents);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/events
// @desc    Get all upcoming events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'upcoming' }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
