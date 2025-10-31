"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.generateResetToken = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../../../utils/email");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// REGISTER USER
const registerUser = async (data) => {
    const { fullName, email, username, password, confirmPassword, country } = data;
    if (password !== confirmPassword)
        throw new Error("Passwords do not match");
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        throw new Error("Email already exists");
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.User.create({
        fullName,
        email,
        username,
        password: hashedPassword,
        country,
    });
    return user;
};
exports.registerUser = registerUser;
// LOGIN USER
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid email or password");
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
};
exports.loginUser = loginUser;
// FORGOT PASSWORD (placeholder)
const forgotPassword = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("Email not found");
    return { message: "enter your email id" };
};
exports.forgotPassword = forgotPassword;
// REQUEST RESET (send email to user)
const generateResetToken = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("Email not found");
    const token = crypto_1.default.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    console.log("Generated token for user:", token);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
  <p>Hello ${user.fullName},</p>
  <p>You requested a password reset. Click below to reset:</p>
  <a href="${resetLink}">${resetLink}</a>
  <p>Link expires in 1 hour.</p>
`;
    await (0, email_1.sendEmail)(user.email, "Password Reset Request", html);
    return { message: "Password reset link sent to your email" };
};
exports.generateResetToken = generateResetToken;
// RESET PASSWORD
const resetPassword = async (token, password, confirmPassword) => {
    if (password !== confirmPassword)
        throw new Error("Passwords do not match");
    const user = await user_model_1.User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
    });
    if (!user)
        throw new Error("Invalid or expired reset token");
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return { message: "Password reset successful" };
};
exports.resetPassword = resetPassword;
