// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { protect } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Parse JSON (normal + CSP violation reports)
app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// Security: baseline headers
app.use(helmet());

// CORS: allow your React frontend
app.use(
  cors({
    origin: "https://localhost:5173", // frontend dev server
    credentials: true,
  })
);

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://localhost:5000"], // ✅ HTTPS
      frameAncestors: ["'none'"], // prevents clickjacking
      "report-uri": ["/csp-report"], // where violation reports go
    },
    reportOnly: process.env.NODE_ENV !== "production", // enforce in prod
  })
);

// CSP Violation reports
app.post("/csp-report", (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    timestamp: new Date(),
  });
});

// Health/test routes
app.get("/", (req, res) => {
  res.send("Secure Blog API running!");
});

app.get("/test", (req, res) => {
  res.json({ message: "This is Secure Blog JSON response" });
});

module.exports = app;
