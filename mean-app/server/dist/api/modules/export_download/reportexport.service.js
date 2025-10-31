"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
exports.getReportById = getReportById;
exports.getReportsByUser = getReportsByUser;
exports.deleteReport = deleteReport;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const reportexport_model_1 = require("./reportexport.model");
const OUTPUT_DIR = path_1.default.resolve(process.cwd(), 'tmp/reports');
async function ensureOutputDir() {
    await fs_extra_1.default.ensureDir(OUTPUT_DIR);
}
async function generateReport(user_id, period, report_type) {
    await ensureOutputDir();
    const timestamp = Date.now();
    const fileName = `${report_type}_${period}_${timestamp}.pdf`;
    const filePath = path_1.default.join(OUTPUT_DIR, fileName);
    // Generate a simple PDF using pdfkit
    const doc = new pdfkit_1.default();
    const stream = fs_extra_1.default.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(18).text(`Report Type: ${report_type}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Reporting Period: ${period}`);
    doc.text(`Generated On: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text('Sample content of the generated report...');
    doc.end();
    await new Promise((resolve, reject) => {
        stream.on('finish', () => resolve());
        stream.on('error', (err) => reject(err));
    });
    // Save report info to MongoDB
    const report = await reportexport_model_1.ReportExport.create({
        user_id,
        period,
        report_type,
        file_path: filePath,
    });
    return report;
}
async function getReportById(id) {
    return reportexport_model_1.ReportExport.findById(id);
}
async function getReportsByUser(user_id) {
    return reportexport_model_1.ReportExport.find({ user_id }).sort({ createdAt: -1 });
}
async function deleteReport(id) {
    const report = await reportexport_model_1.ReportExport.findByIdAndDelete(id);
    if (report && await fs_extra_1.default.pathExists(report.file_path)) {
        await fs_extra_1.default.remove(report.file_path);
    }
    return report;
}
