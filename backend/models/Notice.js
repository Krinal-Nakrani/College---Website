const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Admission", "Exam", "Event", "General"], default: "General" },
    fileUrl: { type: String }, // link to uploaded PDF/image, optional
    pinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
