"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuarterlyReminders = exports.updateReminderStatus = exports.getRemindersByUser = exports.createReminder = void 0;
const taxReminder_model_1 = __importDefault(require("./taxReminder.model"));
const createReminder = async (data) => {
    const reminder = new taxReminder_model_1.default(data);
    return await reminder.save();
};
exports.createReminder = createReminder;
const getRemindersByUser = async (user_id) => {
    return await taxReminder_model_1.default.find({ user_id }).sort({ due_date: 1 });
};
exports.getRemindersByUser = getRemindersByUser;
const updateReminderStatus = async (id, status) => {
    return await taxReminder_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
};
exports.updateReminderStatus = updateReminderStatus;
// 🔹 Generate reminders for all 4 quarters dynamically
const generateQuarterlyReminders = async (user_id, totalTax, startYear) => {
    // Define quarters with due dates. Use month indices (0-based) for Date.
    const quarters = [
        { quarter: "Q1 (Jan-Mar)", due_date: new Date(startYear, 2, 31) },
        { quarter: "Q2 (Apr-Jun)", due_date: new Date(startYear, 5, 30) },
        { quarter: "Q3 (Jul-Sep)", due_date: new Date(startYear, 8, 30) },
        { quarter: "Q4 (Oct-Dec)", due_date: new Date(startYear, 11, 31) },
    ];
    const amountPerQuarter = totalTax / 4;
    const reminders = quarters.map((q) => ({
        user_id,
        quarter: q.quarter,
        due_date: q.due_date,
        amount: amountPerQuarter,
        status: "reminder",
    }));
    // Remove old reminders for this user and the same year before creating new ones
    // We check reminders whose due_date falls within the startYear..startYear range
    const startOfYear = new Date(startYear, 0, 1);
    const endOfYear = new Date(startYear, 11, 31, 23, 59, 59);
    await taxReminder_model_1.default.deleteMany({
        user_id,
        due_date: { $gte: startOfYear, $lte: endOfYear },
    });
    return await taxReminder_model_1.default.insertMany(reminders);
};
exports.generateQuarterlyReminders = generateQuarterlyReminders;
