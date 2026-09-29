const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

// Prevent a user from registering for the same event twice
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
