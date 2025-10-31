"use strict";
//  import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import app from "./app";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// if (process.env.NODE_ENV !== "test") {
//   console.log("🚀 Connecting to MongoDB Atlas...");
//   mongoose
//     .connect(process.env.MONGO_URI!)
//     .then(() => console.log("✅ MongoDB connected"))
//     .catch((err) => console.error("❌ MongoDB connection failed:", err));
// } else {
//   console.log("🧪 Skipping MongoDB connection for test environment");
// }
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Connect to MongoDB
(0, db_1.connectDB)();
// Start server
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
