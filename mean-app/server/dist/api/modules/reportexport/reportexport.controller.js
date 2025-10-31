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
exports.generate = generate;
exports.download = download;
exports.list = list;
exports.remove = remove;
const ReportService = __importStar(require("./reportexport.service"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function generate(req, res) {
    try {
        const { user_id, period, report_type } = req.body;
        if (!user_id || !period || !report_type) {
            return res.status(400).json({ message: 'user_id, period, and report_type are required.' });
        }
        const report = await ReportService.generateReport(user_id, period, report_type);
        return res.status(201).json({
            id: report._id,
            user_id: report.user_id,
            period: report.period,
            report_type: report.report_type,
            file_path: report.file_path,
            download_url: `/api/v1/reportexports/download/${report._id}`,
        });
    }
    catch (err) {
        console.error('Error generating report:', err);
        return res.status(500).json({ message: 'Failed to generate report', error: String(err) });
    }
}
async function download(req, res) {
    try {
        const { id } = req.params;
        const report = await ReportService.getReportById(id);
        if (!report)
            return res.status(404).json({ message: 'Report not found' });
        if (!await fs_extra_1.default.pathExists(report.file_path)) {
            return res.status(410).json({ message: 'Report file missing' });
        }
        res.download(report.file_path);
    }
    catch (err) {
        console.error('Download error:', err);
        return res.status(500).json({ message: 'Failed to download report', error: String(err) });
    }
}
async function list(req, res) {
    try {
        const { user_id } = req.query;
        if (!user_id)
            return res.status(400).json({ message: 'user_id is required' });
        const reports = await ReportService.getReportsByUser(user_id);
        return res.status(200).json(reports);
    }
    catch (err) {
        console.error('List reports error:', err);
        return res.status(500).json({ message: 'Failed to fetch reports', error: String(err) });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        const deleted = await ReportService.deleteReport(id);
        if (!deleted)
            return res.status(404).json({ message: 'Report not found' });
        return res.status(200).json({ message: 'Report deleted successfully' });
    }
    catch (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ message: 'Failed to delete report', error: String(err) });
    }
}
