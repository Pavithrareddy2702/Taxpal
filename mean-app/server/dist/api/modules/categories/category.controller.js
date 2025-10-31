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
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("./category.service"));
const defaultCategories = [
    { name: "Business Expenses", type: "expense" },
    { name: "Office Rent", type: "expense" },
    { name: "Travel", type: "expense" },
    { name: "Salary", type: "income" },
    { name: "Investments", type: "income" }
];
const createCategory = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const category = await categoryService.createCategory(req.body, req.user.id);
        res.status(201).json({ success: true, data: category });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const userCategories = await categoryService.getUserCategories(req.user.id);
        res.json({ success: true, data: [...defaultCategories, ...userCategories] });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
exports.getCategories = getCategories;
const updateCategory = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);
        if (!category)
            return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, data: category });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const category = await categoryService.deleteCategory(req.params.id, req.user.id);
        if (!category)
            return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, message: "Category deleted" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};
exports.deleteCategory = deleteCategory;
