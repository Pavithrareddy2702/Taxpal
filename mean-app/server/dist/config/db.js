"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
// Enable Mongoose debug logging
mongoose_1.default.set("debug", true);
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("❌ MONGO_URI is not defined in .env");
}
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.error(error); // print full error object for more details
        process.exit(1); // stop the app if connection fails
    }
};
exports.connectDB = connectDB;
