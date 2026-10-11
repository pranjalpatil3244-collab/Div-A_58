const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const studentRoutes = require("./routes/studentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const allocationRoutes = require("./routes/allocationRoutes");

const app = express();
const PORT = 5000;

// ===============================
// Middleware
// ===============================
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect("mongodb://localhost:27017/examSeatingDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// ===============================
// API Routes
// ===============================
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/allocation", allocationRoutes);

// ===============================
// Frontend
// ===============================
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    const { default: open } = await import("open");
    await open(`http://localhost:${PORT}`);
    console.log("Browser opened successfully.");
  } catch (error) {
    console.log("Could not open browser automatically.");
    console.log(error.message);
  }
});