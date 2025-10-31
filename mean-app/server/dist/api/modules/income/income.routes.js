"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const income_controller_1 = require("./income.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management
 */
/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Create income
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               source:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Income created
 */
router.post('/', auth_1.auth, income_controller_1.createIncome);
exports.default = router;
