const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Inquiry = require("../models/Inquiry");
const auth = require("../middleware/auth");

// Public: New inquiry
router.post("/", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ msg: "Message sent successfully!", inquiry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: Get all inquiries
router.get("/", auth, async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

// Admin: Reply to inquiry via email
router.post("/:id/reply", auth, async (req, res) => {
  try {
    const { replyText } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ msg: "Inquiry not found" });

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
      to: inquiry.email,
      subject: `Re: ${inquiry.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background:#f4f4f4;">
          <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
            <h2 style="color:#6366f1;">Reply from Portfolio</h2>
            <p>Hi <b>${inquiry.name}</b>,</p>
            <p>${replyText}</p>
            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;">
            <p style="color:#888; font-size:12px;">
              <b>Your original message:</b><br/>
              <i>${inquiry.message}</i>
            </p>
          </div>
        </div>
      `,
    });

    inquiry.status = "replied";
    inquiry.reply = replyText;
    inquiry.repliedAt = new Date();
    await inquiry.save();

    res.json({ msg: "Reply sent successfully", inquiry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: Update status
router.put("/:id", auth, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(inquiry);
});

// Admin: Delete inquiry
router.delete("/:id", auth, async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
