const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const verifyToken = require("../middleware/verifyToken");

// GET /api/notices — newest first, pinned on top
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const notices = await Notice.find(filter).sort({ pinned: -1, publishedAt: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// GET /api/notices/:id — get a single notice
router.get("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notice" });
  }
});

// POST /api/notices — create notice (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/notices/:id — update notice (Protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/notices/:id — partial update (e.g. pin/unpin) (Protected)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/notices/:id — delete notice (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
