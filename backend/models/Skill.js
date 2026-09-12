const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, default: "Frontend" },
  icon: { type: String, default: "" },
});

module.exports = mongoose.model("Skill", skillSchema);
