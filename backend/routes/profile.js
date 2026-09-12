const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Public: Get profile
router.get("/", async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile)
    profile = await Profile.create({
      name: "Your Name",
      title: "MERN Developer",
    });
  res.json(profile);
});

// Admin: Update profile
router.put("/", auth, upload.single("profileImage"), async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.profileImage = `/uploads/${req.file.filename}`;
  let profile = await Profile.findOne();
  if (!profile) profile = new Profile();
  Object.assign(profile, update);
  await profile.save();
  res.json(profile);
});

module.exports = router;
