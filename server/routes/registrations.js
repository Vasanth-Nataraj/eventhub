const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// @route   GET /api/registrations/my
// @desc    Get all events the authenticated user has registered for
router.get('/my', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.userId })
      .populate('eventId')
      .sort({ createdAt: -1 });

    // Filter out orphaned records if any event was deleted
    const events = registrations
      .filter((reg) => reg.eventId)
      .map((reg) => ({
        ...reg.eventId._doc,
        registrationId: reg._id,
        registeredAt: reg.createdAt,
      }));

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/registrations/:eventId
// @desc    Register a user for an event
router.post('/:eventId', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // 1. Check if event exists and has capacity
    const event = await Event.findById(eventId).session(session);
    if (!event) {
       throw new Error('Event not found');
    }
    if (event.registered_count >= event.capacity) {
        throw new Error('Event is full');
    }

    // 2. Check if already registered
    const existingReg = await Registration.findOne({ eventId, userId }).session(session);
    if (existingReg) {
         throw new Error('Already registered for this event');
    }

    // 3. Create registration
    const newReg = new Registration({ eventId, userId });
    await newReg.save({ session });

    // 4. Increment event registered_count
    event.registered_count += 1;
    await event.save({ session });

    await session.commitTransaction();
    res.status(201).json(newReg);

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;