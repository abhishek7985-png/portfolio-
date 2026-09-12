const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

router.post("/", auth, async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(skill);
});

router.put("/:id", auth, async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(skill);
});

router.delete("/:id", auth, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
