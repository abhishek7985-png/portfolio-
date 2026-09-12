const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  github: String,
  linkedin: String,
  twitter: String,
  resume: String,
  profileImage: String,
});

module.exports = mongoose.model("Profile", profileSchema);
