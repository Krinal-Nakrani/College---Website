const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../models/Course");
const verifyToken = require("../middleware/verifyToken");

// Helper: slugify course name if slug not provided
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/courses — list all courses (optional ?level=Diploma/Degree)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.level) {
      filter.level = req.query.level;
    }
    const courses = await Course.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// GET /api/courses/:slugOrId — get a single course by slug or ID
router.get("/:slugOrId", async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      course = await Course.findById(slugOrId);
    }
    if (!course) {
      course = await Course.findOne({ slug: slugOrId });
    }

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

// POST /api/courses — create a new course (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }
    const course = await Course.create(data);
    res.status(201).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A course with this slug already exists." });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/courses/:id — update an existing course (Protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    const updated = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A course with this slug already exists." });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/courses/:id — delete a course (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
