require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const coursesRouter = require("./routes/courses");
const noticesRouter = require("./routes/notices");
const contactRouter = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_website";

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/courses", coursesRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/contact", contactRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
