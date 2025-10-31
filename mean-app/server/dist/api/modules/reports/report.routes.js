"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = __importDefault(require("./report.controller"));
const auth_1 = require("../../middlewares/auth");
//new
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/v1/reports/generate:
 *   post:
 *     summary: Generate a new financial report
 *     tags: [Reports]
 */
router.post("/generate", auth_1.auth, report_controller_1.default.generateReport);
/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Get all reports for user
 *     tags: [Reports]
 */
router.get("/", auth_1.auth, report_controller_1.default.getReports);
/**
 * @swagger
 * /api/v1/reports/stats:
 *   get:
 *     summary: Get report statistics
 *     tags: [Reports]
 */
router.get("/stats", auth_1.auth, report_controller_1.default.getStats);
/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 */
router.get("/:id", auth_1.auth, report_controller_1.default.getReportById);
/**
 * @swagger
 * /api/v1/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 */
router.delete("/:id", auth_1.auth, report_controller_1.default.deleteReport);
/**
 * @swagger
 * /api/v1/reports/download/{id}:
 *   get:
 *     summary: Download report file
 *     tags: [Reports]
 */
router.get("/download/:id", auth_1.auth, report_controller_1.default.downloadReport);
exports.default = router;
