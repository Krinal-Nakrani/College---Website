const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ["Diploma", "Degree"], required: true },
    department: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "3 Years"
    intake: { type: Number, required: true },
    summary: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
