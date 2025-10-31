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
Object.defineProperty(exports, "__esModule", { value: true });
//new
const mongoose_1 = __importStar(require("mongoose"));
const report_types_1 = require("./report.types");
// Delete existing cached model to avoid OverwriteModelError in development
if (mongoose_1.default.models['Report']) {
    delete mongoose_1.default.models['Report'];
}
const reportSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        index: true,
    },
    reportType: {
        type: String,
        enum: Object.values(report_types_1.ReportType),
        required: [true, "Report type is required"],
    },
    period: {
        type: String,
        enum: Object.values(report_types_1.ReportPeriod),
        required: [true, "Period is required"],
    },
    format: {
        type: String,
        enum: Object.values(report_types_1.ReportFormat),
        required: [true, "Format is required"],
        default: report_types_1.ReportFormat.PDF,
    },
    status: {
        type: String,
        enum: Object.values(report_types_1.ReportStatus),
        default: report_types_1.ReportStatus.PENDING,
    },
    reportData: {
        summary: {
            totalIncome: Number,
            totalExpense: Number,
            netIncome: Number,
            taxLiability: Number,
        },
        details: [mongoose_1.Schema.Types.Mixed],
        charts: [mongoose_1.Schema.Types.Mixed],
        period: {
            startDate: Date,
            endDate: Date,
        },
    },
    customPeriod: {
        startDate: Date,
        endDate: Date,
    },
    generatedAt: {
        type: Date,
    },
    fileUrl: {
        type: String,
    },
    fileName: {
        type: String,
    },
    errorMessage: {
        type: String,
    },
}, {
    timestamps: true,
    collection: "reports",
});
// Indexes for performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
// Create the model
const Report = mongoose_1.default.models.Report || mongoose_1.default.model("Report", reportSchema);
exports.default = Report;
