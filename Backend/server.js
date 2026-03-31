import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import tradeRoutes from "./routes/tradeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        console.log("⚠️ Server will continue to run, but database features may be unavailable.");
    });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/market", marketRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});