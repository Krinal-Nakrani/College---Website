require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// ── Safely import firebase-admin ──────────────────────────
let admin;
try {
  admin = require("firebase-admin");
} catch (err) {
  console.error("\n============================================================");
  console.error("❌ ERROR: 'firebase-admin' module is not installed yet!");
  console.error("👉 Please run: npm install");
  console.error("   inside the 'backend' folder, then restart.");
  console.error("============================================================\n");
  process.exit(1);
}

// ── Firebase Admin SDK init ──────────────────────────────
let serviceAccount = null;

// 1. Check env var FIREBASE_SERVICE_ACCOUNT
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();

  if (raw.startsWith("{")) {
    try {
      serviceAccount = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT as JSON:", e.message);
    }
  } else {
    // Try resolving as file path relative to __dirname or cwd
    const candidates = [
      path.resolve(__dirname, raw),
      path.resolve(process.cwd(), raw),
      path.resolve(__dirname, path.basename(raw)),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        try {
          serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          break;
        } catch (e) {
          console.error(`Error reading ${filePath}:`, e.message);
        }
      }
    }

    if (!serviceAccount) {
      // Check if it's base64 encoded
      try {
        const decoded = Buffer.from(raw, "base64").toString("utf-8");
        if (decoded.trim().startsWith("{")) {
          serviceAccount = JSON.parse(decoded);
        }
      } catch (e) {
        // Not base64
      }
    }
  }
}

// 2. Fallback: auto-detect serviceAccountKey.json in backend directory
if (!serviceAccount) {
  const defaultKeyPath = path.join(__dirname, "serviceAccountKey.json");
  if (fs.existsSync(defaultKeyPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(defaultKeyPath, "utf-8"));
      console.log("Auto-detected serviceAccountKey.json in backend folder");
    } catch (e) {
      console.error("Error reading default serviceAccountKey.json:", e.message);
    }
  }
}

// 3. Initialize Firebase Admin
if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully with service account");
  } catch (err) {
    console.error("Firebase Admin initialization failed:", err.message);
  }
} else {
  console.warn(
    "⚠️  FIREBASE_SERVICE_ACCOUNT not configured. Admin write operations will be blocked until configured."
  );
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "college-website-c9a4e",
      });
    } catch (err) {
      console.warn("Default Firebase app init skipped:", err.message);
    }
  }
}

// ── Routers & Models ──────────────────────────────────────
const coursesRouter = require("./routes/courses");
const noticesRouter = require("./routes/notices");
const contactRouter = require("./routes/contact");
const Course = require("./models/Course");
const Notice = require("./models/Notice");
const ContactMessage = require("./models/ContactMessage");
const verifyToken = require("./middleware/verifyToken");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_website";

// ── CORS – allow public site, admin panel, and local dev ───
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.ADMIN_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);

      // Allow known origins or any localhost during dev
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com")
      ) {
        return cb(null, true);
      }

      return cb(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    firebase: admin.apps.length > 0 ? "initialized" : "not_initialized",
  });
});

// ── Dashboard Stats (Protected) ───────────────────────────
app.get("/api/stats", verifyToken, async (req, res) => {
  try {
    const [coursesCount, noticesCount, messagesCount, newMessagesCount] =
      await Promise.all([
        Course.countDocuments(),
        Notice.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ status: "new" }),
      ]);

    res.json({
      courses: coursesCount,
      notices: noticesCount,
      messages: messagesCount,
      newMessages: newMessagesCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// ── Resource Routes ───────────────────────────────────────
app.use("/api/courses", coursesRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/contacts", contactRouter); // alias

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ── Database & Server Start ───────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
