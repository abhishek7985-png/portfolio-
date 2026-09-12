const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Public: Get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// Public: Get single project
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

// Admin: Add project
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const data = {
      ...req.body,
      technologies: req.body.technologies
        ? req.body.technologies.split(",").map((t) => t.trim())
        : [],
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };
    const project = new Project(data);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: Update project
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  const update = { ...req.body };
  if (req.body.technologies)
    update.technologies = req.body.technologies.split(",").map((t) => t.trim());
  if (req.file) update.image = `/uploads/${req.file.filename}`;
  const project = await Project.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(project);
});

// Admin: Delete project
router.delete("/:id", auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
