"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.requestReset = exports.forgot = exports.login = exports.register = void 0;
const user_service_1 = require("./user.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// REGISTER
const register = async (req, res) => {
    try {
        const user = await (0, user_service_1.registerUser)(req.body);
        res.status(201).json({
            message: "Account created successfully. Please log in to continue.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                country: user.country,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    try {
        const { user, token } = await (0, user_service_1.loginUser)(req.body);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                country: user.country,
            },
            token,
        });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.login = login;
// FORGOT PASSWORD (placeholder)
const forgot = async (req, res) => {
    try {
        const response = await (0, user_service_1.forgotPassword)(req.body.email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.forgot = forgot;
// REQUEST RESET
const requestReset = async (req, res) => {
    try {
        const response = await (0, user_service_1.generateResetToken)(req.body.email);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.requestReset = requestReset;
// RESET PASSWORD
const reset = async (req, res) => {
    try {
        const token = req.params.token;
        const { newPassword, confirmPassword } = req.body;
        const response = await (0, user_service_1.resetPassword)(token, newPassword, confirmPassword);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.reset = reset;
