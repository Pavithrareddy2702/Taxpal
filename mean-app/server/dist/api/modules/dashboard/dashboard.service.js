"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertDashboard = exports.deleteTransaction = exports.updateTransaction = exports.addTransaction = exports.getDashboard = void 0;
const dashboard_model_1 = require("./dashboard.model");
const income_model_1 = require("../income/income.model");
const expense_model_1 = require("../expense/expense.model");
/**
 * Fetch the dashboard for a user
 * Returns only dashboard.transactions (user-added) in the array
 * Calculates totals from Income/Expense collections
 */
const getDashboard = async (userId) => {
    const dashboard = await dashboard_model_1.DashboardModel.findOne({ user: userId });
    if (!dashboard)
        return null;
    // Only user-added transactions are returned
    const allTransactions = [...dashboard.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Calculate totals from Income/Expense collections
    const totalIncomeAgg = await income_model_1.Income.aggregate([
        { $match: { userId } },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    const totalExpensesAgg = await expense_model_1.Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    const totalIncome = totalIncomeAgg[0]?.sum || 0;
    const totalExpenses = totalExpensesAgg[0]?.sum || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    return {
        ...dashboard.toObject(),
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        savingsRate,
        transactions: allTransactions
    };
};
exports.getDashboard = getDashboard;
// Add a user-created transaction
const addTransaction = async (dashboardId, txData) => {
    const dashboard = await dashboard_model_1.DashboardModel.findById(dashboardId);
    if (!dashboard)
        return null;
    dashboard.transactions.push(txData);
    await dashboard.save();
    return dashboard;
};
exports.addTransaction = addTransaction;
// Update a user-created transaction
const updateTransaction = async (dashboardId, txId, txData) => {
    const dashboard = await dashboard_model_1.DashboardModel.findById(dashboardId);
    if (!dashboard)
        return null;
    const tx = dashboard.transactions.id(txId);
    if (!tx)
        return null;
    tx.set(txData);
    await dashboard.save();
    return dashboard;
};
exports.updateTransaction = updateTransaction;
// Delete a user-created transaction
const deleteTransaction = async (dashboardId, txId) => {
    const dashboard = await dashboard_model_1.DashboardModel.findById(dashboardId);
    if (!dashboard)
        return null;
    const tx = dashboard.transactions.id(txId);
    if (!tx)
        return null;
    await tx.deleteOne();
    await dashboard.save();
    return dashboard;
};
exports.deleteTransaction = deleteTransaction;
// Create or update dashboard
const upsertDashboard = async (userId) => {
    const incomes = await income_model_1.Income.find({ userId });
    const expenses = await expense_model_1.Expense.find({ userId });
    const monthlyIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const estimatedTaxDue = monthlyIncome * 0.1;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    // Only keep user-added transactions in dashboard.transactions
    let dashboard = await dashboard_model_1.DashboardModel.findOne({ user: userId });
    if (!dashboard) {
        dashboard = new dashboard_model_1.DashboardModel({
            user: userId,
            monthlyIncome,
            monthlyExpenses,
            estimatedTaxDue,
            savingsRate,
            transactions: []
        });
    }
    else {
        dashboard.set({
            monthlyIncome,
            monthlyExpenses,
            estimatedTaxDue,
            savingsRate
            // Do not overwrite transactions to avoid duplicates
        });
    }
    await dashboard.save();
    return dashboard;
};
exports.upsertDashboard = upsertDashboard;
