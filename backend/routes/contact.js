const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const verifyToken = require("../middleware/verifyToken");

// POST /api/contact — public enquiry submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      course: course || "",
      message: message || "",
      status: "new",
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: newMessage,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/contact — get all enquiries for admin (Protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && ["new", "contacted", "closed"].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

// PATCH /api/contact/:id — update message status (Protected)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (status && !["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Contact message not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/contact/:id — replace / update message (Protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Contact message not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/contact/:id — delete enquiry (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Contact message not found" });
    }
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
