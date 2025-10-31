"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExpense = void 0;
const expense_model_1 = require("./expense.model");
const addExpense = async (userId, data) => {
    const expense = await expense_model_1.Expense.create({ ...data, userId });
    return expense;
};
exports.addExpense = addExpense;
