"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const budget_model_1 = require("./budget.model");
const calculateStatus = (amount, spent) => {
    // NOTE: Status logic is based ONLY on the total budget amount, as per the current implementation criteria.
    if (amount <= 0) {
        return 'Poor';
    }
    // Budget less than $100 -> Poor
    if (amount < 100) {
        return 'Poor';
    }
    // Budget between $100 and $500 (inclusive) -> Fair
    if (amount <= 500) {
        return 'Fair';
    }
    // Budget above $500 -> Good
    return 'Good';
};
class BudgetService {
    async getBudgetsByUser(userId) {
        const budgets = await budget_model_1.Budget.find({ userId: userId }).lean().exec();
        return budgets.map(budget => {
            // Logic for fetched budgets: Ensures remaining is calculated correctly
            const remaining = budget.amount - budget.spent;
            const status = calculateStatus(budget.amount, budget.spent);
            return {
                ...budget, // Includes _id, createdAt, etc. from .lean()
                remaining: remaining,
                status: status
            };
        });
    }
    // POST (Create) Operations
    async createBudget(data) {
        const newBudget = new budget_model_1.Budget({
            ...data,
            spent: data.spent ?? 0,
        });
        // Save the document
        const savedDoc = await newBudget.save();
        // Get the plain object representation to return
        const savedBudget = savedDoc.toObject();
        // FIX: Calculate final response fields correctly: remaining = amount - spent
        const remaining = savedBudget.amount - savedBudget.spent;
        const status = calculateStatus(savedBudget.amount, savedBudget.spent);
        return {
            ...savedBudget, // Includes _id, createdAt, etc.
            remaining: remaining,
            status: status
        };
    }
    // DELETE Operations
    async deleteBudget(budgetId) {
        // This method is fine, it returns the deleted document or null.
        return budget_model_1.Budget.findByIdAndDelete(budgetId).exec();
    }
}
exports.BudgetService = BudgetService;
