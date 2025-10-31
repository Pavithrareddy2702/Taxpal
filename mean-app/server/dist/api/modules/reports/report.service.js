"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report_model_1 = __importDefault(require("./report.model"));
const report_types_1 = require("./report.types");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const income_model_1 = require("../income/income.model");
const expense_model_1 = require("../expense/expense.model");
const budget_model_1 = require("../budget/budget.model");
const mongoose_1 = __importDefault(require("mongoose"));
class ReportService {
    calculateDateRange(period, customPeriod) {
        const now = new Date();
        let startDate;
        let endDate = new Date(now);
        switch (period) {
            case report_types_1.ReportPeriod.CURRENT_MONTH:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.LAST_MONTH:
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.CURRENT_QUARTER:
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.LAST_QUARTER:
                const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
                const year = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
                const quarter = lastQuarter < 0 ? 3 : lastQuarter;
                startDate = new Date(year, quarter * 3, 1);
                endDate = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.CURRENT_YEAR:
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.LAST_YEAR:
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                break;
            case report_types_1.ReportPeriod.CUSTOM:
                if (!customPeriod)
                    throw new Error("Custom period dates are required");
                startDate = new Date(customPeriod.startDate);
                endDate = new Date(customPeriod.endDate);
                break;
            default:
                throw new Error("Invalid period");
        }
        return { startDate, endDate };
    }
    // Helper method to get months in range for Budget queries
    getMonthsInRange(startDate, endDate) {
        const months = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
            // Move to next month
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }
    async generateReportData(userId, reportType, startDate, endDate) {
        const reportData = {
            period: { startDate, endDate },
            summary: {},
            details: [],
            charts: []
        };
        try {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            if (reportType === report_types_1.ReportType.INCOME_STATEMENT) {
                const incomes = await income_model_1.Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const expenses = await expense_model_1.Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
                const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
                reportData.summary = {
                    totalIncome,
                    totalExpense,
                    netIncome: totalIncome - totalExpense
                };
                reportData.details = { incomes, expenses };
            }
            if (reportType === report_types_1.ReportType.EXPENSE_REPORT) {
                const expenses = await expense_model_1.Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
                reportData.summary = { totalExpense };
                reportData.details = expenses;
            }
            if (reportType === report_types_1.ReportType.TAX_SUMMARY) {
                const incomes = await income_model_1.Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const expenses = await expense_model_1.Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
                const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
                const taxableIncome = totalIncome - totalExpense;
                const taxRate = 0.1; // example 10%
                const taxLiability = taxableIncome > 0 ? taxableIncome * taxRate : 0;
                reportData.summary = { totalIncome, totalExpense, taxableIncome, taxLiability };
                reportData.details = { incomes, expenses };
            }
            if (reportType === report_types_1.ReportType.BUDGET_ANALYSIS) {
                // Convert date range to month format (YYYY-MM)
                const months = this.getMonthsInRange(startDate, endDate);
                // Query budgets by month instead of date
                const budgets = await budget_model_1.Budget.find({
                    userId: userObjectId,
                    month: { $in: months }
                }).lean();
                const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
                const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
                reportData.summary = {
                    totalBudget,
                    totalSpent,
                    remaining: totalBudget - totalSpent
                };
                reportData.details = budgets;
            }
            if (reportType === report_types_1.ReportType.CASH_FLOW) {
                const incomes = await income_model_1.Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const expenses = await expense_model_1.Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
                const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
                const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
                reportData.summary = {
                    openingBalance: 0,
                    totalIncome,
                    totalExpense,
                    netCashFlow: totalIncome - totalExpense,
                    closingBalance: totalIncome - totalExpense
                };
                reportData.details = { incomes, expenses };
            }
            return reportData;
        }
        catch (error) {
            console.error("Error generating report data:", error);
            throw new Error(`Failed to generate report data: ${error.message}`);
        }
    }
    async processReportGeneration(reportId, userId, reportType, startDate, endDate) {
        try {
            await report_model_1.default.findByIdAndUpdate(reportId, { status: report_types_1.ReportStatus.GENERATING });
            const reportData = await this.generateReportData(userId, reportType, startDate, endDate);
            const fileName = `${reportType.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
            const filePath = path_1.default.join(__dirname, "../../../public/reports", fileName);
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            const doc = new pdfkit_1.default();
            doc.pipe(fs_1.default.createWriteStream(filePath));
            doc.fontSize(20).text(`${reportType} Report`, { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Period: ${startDate.toDateString()} - ${endDate.toDateString()}`);
            doc.moveDown();
            doc.text("Summary:");
            doc.moveDown();
            for (const key in reportData.summary) {
                doc.text(`${key}: ${reportData.summary[key]}`);
            }
            doc.end();
            await report_model_1.default.findByIdAndUpdate(reportId, {
                status: report_types_1.ReportStatus.COMPLETED,
                reportData,
                generatedAt: new Date(),
                fileName,
                fileUrl: `/reports/${fileName}`
            });
        }
        catch (error) {
            console.error("Report generation error:", error);
            await report_model_1.default.findByIdAndUpdate(reportId, {
                status: report_types_1.ReportStatus.FAILED,
                errorMessage: error.message
            });
        }
    }
    async createReport(data) {
        try {
            const { startDate, endDate } = this.calculateDateRange(data.period, data.customPeriod);
            const report = new report_model_1.default({
                userId: data.userId,
                reportType: data.reportType,
                period: data.period,
                format: data.format,
                status: report_types_1.ReportStatus.PENDING,
                customPeriod: data.customPeriod
            });
            await report.save();
            this.processReportGeneration(report._id.toString(), data.userId, data.reportType, startDate, endDate);
            return report;
        }
        catch (error) {
            throw new Error(`Failed to create report: ${error.message}`);
        }
    }
    async getUserReports(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const reports = await report_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await report_model_1.default.countDocuments({ userId });
        return { reports, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getReportById(reportId, userId) {
        return await report_model_1.default.findOne({ _id: reportId, userId });
    }
    async deleteReport(reportId, userId) {
        const result = await report_model_1.default.deleteOne({ _id: reportId, userId });
        return result.deletedCount > 0;
    }
    async getReportStats(userId) {
        const stats = await report_model_1.default.aggregate([
            { $match: { userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        return stats.reduce((acc, stat) => { acc[stat._id] = stat.count; return acc; }, {});
    }
}
exports.default = new ReportService();
