"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const mongoose_1 = require("mongoose");
const BudgetSchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    description: { type: String },
    spent: { type: Number, default: 0 },
    userId: { type: String, required: true }
}, { timestamps: true });
exports.Budget = (0, mongoose_1.model)('Budget', BudgetSchema);
