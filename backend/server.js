require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ==================== MIDDLEWARE ====================

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// JSON body
app.use(express.json());

// URL encoded body
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ENV CHECK ====================

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES ✅" : "NO ❌");

console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "Not set");

console.log("CLIENT_URL:", process.env.CLIENT_URL || "Not set");

console.log("MONGO_URI:", process.env.MONGO_URI ? "YES ✅" : "NO ❌");

// ==================== TEST ROUTE ====================

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Portfolio API running 🚀",
  });
});

// ==================== API ROUTES ====================

app.use("/api/auth", require("./routes/auth"));

app.use("/api/inquiry", require("./routes/inquiry"));

app.use("/api/project", require("./routes/project"));

app.use("/api/skill", require("./routes/skill"));

app.use("/api/profile", require("./routes/profile"));

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this request",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==================== MONGODB + SERVER ====================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });
