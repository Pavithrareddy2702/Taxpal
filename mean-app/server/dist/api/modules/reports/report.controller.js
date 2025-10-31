"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report_service_1 = __importDefault(require("./report.service"));
const report_types_1 = require("./report.types");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ReportController {
    async generateReport(req, res) {
        try {
            const { reportType, period, format = report_types_1.ReportFormat.PDF, customPeriod } = req.body;
            if (!reportType || !Object.values(report_types_1.ReportType).includes(reportType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report type"
                });
            }
            if (!period || !Object.values(report_types_1.ReportPeriod).includes(period)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid period"
                });
            }
            if (period === report_types_1.ReportPeriod.CUSTOM) {
                if (!customPeriod || !customPeriod.startDate || !customPeriod.endDate) {
                    return res.status(400).json({
                        success: false,
                        message: "Custom period requires startDate and endDate"
                    });
                }
                const startDate = new Date(customPeriod.startDate);
                const endDate = new Date(customPeriod.endDate);
                if (startDate >= endDate) {
                    return res.status(400).json({
                        success: false,
                        message: "Start date must be before end date"
                    });
                }
            }
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. Please login to generate reports."
                });
            }
            const report = await report_service_1.default.createReport({
                userId,
                reportType,
                period,
                format,
                customPeriod
            });
            return res.status(201).json({
                success: true,
                message: "Report generation started",
                data: report
            });
        }
        catch (error) {
            console.error("Generate report error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to generate report"
            });
        }
    }
    async getReports(req, res) {
        try {
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await report_service_1.default.getUserReports(userId, page, limit);
            return res.status(200).json({
                success: true,
                data: result.reports,
                pagination: result.pagination
            });
        }
        catch (error) {
            console.error("Get reports error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch reports"
            });
        }
    }
    async getReportById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            if (!id || id.length !== 24) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report ID"
                });
            }
            const report = await report_service_1.default.getReportById(id, userId);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }
            return res.status(200).json({
                success: true,
                data: report
            });
        }
        catch (error) {
            console.error("Get report error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch report"
            });
        }
    }
    async deleteReport(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            if (!id || id.length !== 24) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report ID"
                });
            }
            const deleted = await report_service_1.default.deleteReport(id, userId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Report deleted successfully"
            });
        }
        catch (error) {
            console.error("Delete report error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to delete report"
            });
        }
    }
    //new
    async downloadReport(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || req.user?._id;
            if (!userId)
                return res.status(401).json({ success: false, message: "Authentication required" });
            const report = await report_service_1.default.getReportById(id, userId);
            if (!report)
                return res.status(404).json({ success: false, message: "Report not found" });
            if (report.status !== "completed")
                return res.status(400).json({ success: false, message: `Report is ${report.status}. Cannot download yet.` });
            if (!report.fileUrl)
                return res.status(404).json({ success: false, message: "File not available" });
            const filePath = path_1.default.join(__dirname, '../../../public', report.fileUrl); // adjust path to your public folder
            if (!fs_1.default.existsSync(filePath))
                return res.status(404).json({ success: false, message: "File not found on server" });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
            const fileStream = fs_1.default.createReadStream(filePath);
            fileStream.pipe(res);
        }
        catch (error) {
            console.error("Download report error:", error);
            res.status(500).json({ success: false, message: error.message || "Failed to download report" });
        }
    }
    async getStats(req, res) {
        try {
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }
            const stats = await report_service_1.default.getReportStats(userId);
            return res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error("Get stats error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch statistics"
            });
        }
    }
}
exports.default = new ReportController();
