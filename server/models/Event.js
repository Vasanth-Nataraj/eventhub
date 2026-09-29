const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    registered_count: { type: Number, default: 0 },
    tags: [{ type: String }], // Maps to user skills/interests
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
