const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// GET /api/notices  — newest first, pinned on top
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ pinned: -1, publishedAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// POST /api/notices  — admin panel creates a notice
router.post("/", async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/notices/:id
router.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
