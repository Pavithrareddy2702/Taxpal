"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "No token provided" });
    const token = header.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Invalid token format" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.id }; // now TypeScript knows this exists
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.auth = auth;
