const mongoose = require("mongoose");

const tagsMasterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "React.js"
  category: {
    type: String,
    enum: ["skill", "interest", "event_type"],
    required: true,
  },
  aliases: [{ type: String }], // e.g., ["react", "reactjs", "react js"]
});

module.exports = mongoose.model("TagsMaster", tagsMasterSchema);
