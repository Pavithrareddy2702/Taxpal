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
exports.upsertDashboardController = exports.deleteTransactionController = exports.updateTransactionController = exports.addTransactionController = exports.getDashboardController = void 0;
const DashboardService = __importStar(require("./dashboard.service"));
const getDashboardController = async (req, res) => {
    const dashboard = await DashboardService.getDashboard(req.params.id);
    if (!dashboard)
        return res.status(404).json({ message: "Dashboard not found" });
    return res.json(dashboard);
};
exports.getDashboardController = getDashboardController;
const addTransactionController = async (req, res) => {
    const { dashboardId } = req.params;
    const txData = req.body;
    const dashboard = await DashboardService.addTransaction(dashboardId, txData);
    if (!dashboard)
        return res.status(404).json({ message: "Dashboard not found" });
    return res.json(dashboard);
};
exports.addTransactionController = addTransactionController;
const updateTransactionController = async (req, res) => {
    const { dashboardId, txId } = req.params;
    const txData = req.body;
    const dashboard = await DashboardService.updateTransaction(dashboardId, txId, txData);
    if (!dashboard)
        return res.status(404).json({ message: "Dashboard or transaction not found" });
    return res.json(dashboard);
};
exports.updateTransactionController = updateTransactionController;
const deleteTransactionController = async (req, res) => {
    const { dashboardId, txId } = req.params;
    const dashboard = await DashboardService.deleteTransaction(dashboardId, txId);
    if (!dashboard)
        return res.status(404).json({ message: "Dashboard or transaction not found" });
    return res.json(dashboard);
};
exports.deleteTransactionController = deleteTransactionController;
// Upsert dashboard (create if not exists)
const upsertDashboardController = async (req, res) => {
    const { userId } = req.params;
    try {
        // No need to pass `data`; service will calculate from Income & Expense collections
        const dashboard = await DashboardService.upsertDashboard(userId);
        res.json(dashboard);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.upsertDashboardController = upsertDashboardController;
