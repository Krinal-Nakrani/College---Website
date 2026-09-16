const admin = require("firebase-admin");

/**
 * Middleware to verify Firebase ID tokens on protected routes.
 * Expects header: "Authorization: Bearer <token>"
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization header missing or invalid. Format must be 'Bearer <token>'",
    });
  }

  const token = authHeader.split(" ")[1];

  // Verify that Firebase Admin is initialized
  if (!admin.apps.length) {
    console.error("Firebase Admin is not initialized. Cannot verify token.");
    return res.status(500).json({
      error: "Server authentication service is currently unconfigured.",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Optional admin email whitelist check
    if (process.env.ADMIN_EMAILS) {
      const allowedEmails = process.env.ADMIN_EMAILS.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = (decodedToken.email || "").toLowerCase();
      if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
        return res.status(403).json({
          error: "Forbidden: Account is not authorized to access staff portal.",
        });
      }
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Token expired. Please re-authenticate." });
    }
    return res.status(401).json({ error: "Invalid token or unauthorized access." });
  }
}

module.exports = verifyToken;
