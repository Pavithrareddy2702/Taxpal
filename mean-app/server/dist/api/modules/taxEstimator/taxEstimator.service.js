"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstimateById = exports.getEstimates = exports.createEstimate = exports.calculateEstimatedTax = void 0;
const taxEstimator_model_1 = __importDefault(require("./taxEstimator.model"));
const reminderService = __importStar(require("../taxRemainders/taxReminder.service"));
// Tax calculation logic
const calculateEstimatedTax = (data) => {
    const { gross_income_for_quarter = 0, business_expenses = 0, retirement_contribution = 0, health_insurance_premiums = 0, home_office_deduction = 0, } = data;
    const deductions = business_expenses +
        retirement_contribution +
        health_insurance_premiums +
        home_office_deduction;
    const taxableIncome = gross_income_for_quarter - deductions;
    // Example: flat 20% tax
    return taxableIncome > 0 ? taxableIncome * 0.2 : 0;
};
exports.calculateEstimatedTax = calculateEstimatedTax;
const getDueDateForQuarter = (quarter) => {
    const year = new Date().getFullYear();
    switch (quarter) {
        case "Q1 (Jan-Mar)":
            return new Date(year, 2, 31); // March 31
        case "Q2 (Apr-Jun)":
            return new Date(year, 5, 30); // June 30
        case "Q3 (Jul-Sep)":
            return new Date(year, 8, 30); // September 30
        case "Q4 (Oct-Dec)":
            return new Date(year, 11, 31); // December 31
        default:
            return new Date(); // fallback: today
    }
};
const createEstimate = async (data) => {
    const estimated_tax = (0, exports.calculateEstimatedTax)(data);
    const due_date = data.quarter ? getDueDateForQuarter(data.quarter) : undefined;
    const newEstimate = new taxEstimator_model_1.default({ ...data, estimated_tax, due_date });
    const savedEstimate = await newEstimate.save();
    // ✅ Automatically generate reminders for the entire year
    if (data.user_id) {
        const year = new Date().getFullYear();
        await reminderService.generateQuarterlyReminders(data.user_id.toString(), estimated_tax, // assuming this quarter represents 1/4th of total
        year);
    }
    return savedEstimate;
};
exports.createEstimate = createEstimate;
const getEstimates = async () => {
    return await taxEstimator_model_1.default.find();
};
exports.getEstimates = getEstimates;
const getEstimateById = async (id) => {
    return await taxEstimator_model_1.default.findById(id);
};
exports.getEstimateById = getEstimateById;
