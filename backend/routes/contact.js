const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact — enquiry / admission form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email and phone are required" });
    }
    const entry = await ContactMessage.create({ name, email, phone, course, message });
    res.status(201).json({ success: true, id: entry._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/contact — admin panel: list enquiries
router.get("/", async (req, res) => {
  try {
    const entries = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

module.exports = router;
