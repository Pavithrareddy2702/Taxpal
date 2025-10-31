"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.ReportFormat = exports.ReportPeriod = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["INCOME_STATEMENT"] = "Income Statement";
    ReportType["EXPENSE_REPORT"] = "Expense Report";
    ReportType["TAX_SUMMARY"] = "Tax Summary";
    ReportType["BUDGET_ANALYSIS"] = "Budget Analysis";
    ReportType["CASH_FLOW"] = "Cash Flow Statement";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportPeriod;
(function (ReportPeriod) {
    ReportPeriod["CURRENT_MONTH"] = "Current Month";
    ReportPeriod["LAST_MONTH"] = "Last Month";
    ReportPeriod["CURRENT_QUARTER"] = "Current Quarter";
    ReportPeriod["LAST_QUARTER"] = "Last Quarter";
    ReportPeriod["CURRENT_YEAR"] = "Current Year";
    ReportPeriod["LAST_YEAR"] = "Last Year";
    ReportPeriod["CUSTOM"] = "Custom";
})(ReportPeriod || (exports.ReportPeriod = ReportPeriod = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "PDF";
    ReportFormat["EXCEL"] = "Excel";
    ReportFormat["CSV"] = "CSV";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
