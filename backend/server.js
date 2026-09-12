require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ========== CORS CONFIGURATION ==========
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite
  "https://portfolio-rn1n.vercel.app", // Aapka Vercel frontend
  "https://portfolio-7j2d.vercel.app", // Purana Vercel (agar hai)
  "https://portfolio-two-ruddy-59.vercel.app", // Aur koi bhi purana
];

const corsOptions = {
  origin: function (origin, callback) {
    // Postman / mobile apps ke liye (origin undefined hota hai)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Preflight requests handle karo
app.options("*", cors(corsOptions));

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========== DEBUG LOGGING ==========
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES ✅" : "NO ❌");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

// ========== ROUTES ==========
app.use("/api/auth", require("./routes/auth"));
app.use("/api/inquiry", require("./routes/inquiry"));
app.use("/api/project", require("./routes/project"));
app.use("/api/skill", require("./routes/skill"));
app.use("/api/profile", require("./routes/profile"));

// ========== HEALTH CHECK ==========
app.get("/", (req, res) => {
  res.json({
    status: "✅ Backend is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ========== MONGODB ==========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
