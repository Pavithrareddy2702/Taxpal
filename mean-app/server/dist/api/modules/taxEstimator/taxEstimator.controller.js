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
exports.getTaxEstimateById = exports.getTaxEstimates = exports.createTaxEstimate = void 0;
const taxService = __importStar(require("./taxEstimator.service"));
const createTaxEstimate = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const estimate = await taxService.createEstimate({
            ...req.body,
            user_id: req.user.id, // take from token, not body
        });
        res.status(201).json(estimate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTaxEstimate = createTaxEstimate;
const getTaxEstimates = async (_req, res) => {
    try {
        const estimates = await taxService.getEstimates();
        res.json(estimates);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTaxEstimates = getTaxEstimates;
const getTaxEstimateById = async (req, res) => {
    try {
        const estimate = await taxService.getEstimateById(req.params.id);
        if (!estimate)
            return res.status(404).json({ message: "Not found" });
        res.json(estimate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTaxEstimateById = getTaxEstimateById;
