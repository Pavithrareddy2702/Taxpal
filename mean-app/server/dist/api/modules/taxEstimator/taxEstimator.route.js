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
const express_1 = require("express");
const controller = __importStar(require("./taxEstimator.controller"));
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: TaxEstimator
 *   description: Tax estimation management
 */
/**
 * @swagger
 * /api/v1/tax-estimates:
 *   post:
 *     summary: Create a new tax estimate
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               quarter:
 *                 type: string
 *               filing_status:
 *                 type: string
 *               gross_income_for_quarter:
 *                 type: number
 *               business_expenses:
 *                 type: number
 *               retirement_contribution:
 *                 type: number
 *               health_insurance_premiums:
 *                 type: number
 *               home_office_deduction:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tax estimate created
 */
router.post("/", auth_1.auth, controller.createTaxEstimate);
/**
 * @swagger
 * /api/v1/tax-estimates:
 *   get:
 *     summary: Get all tax estimates
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     responses:
 *       200:
 *         description: List of tax estimates
 */
router.get("/", auth_1.auth, controller.getTaxEstimates);
/**
 * @swagger
 * /api/v1/tax-estimates/{id}:
 *   get:
 *     summary: Get tax estimate by ID
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tax estimate object
 *       404:
 *         description: Not found
 */
router.get("/:id", auth_1.auth, controller.getTaxEstimateById);
exports.default = router;
