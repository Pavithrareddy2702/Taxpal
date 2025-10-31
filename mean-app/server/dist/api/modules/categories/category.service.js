"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getUserCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("./category.model"));
const createCategory = async (data, userId) => {
    const category = new category_model_1.default({ ...data, createdBy: userId });
    return await category.save();
};
exports.createCategory = createCategory;
const getUserCategories = async (userId) => {
    return await category_model_1.default.find({ createdBy: userId });
};
exports.getUserCategories = getUserCategories;
const updateCategory = async (id, data, userId) => {
    return await category_model_1.default.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id, userId) => {
    return await category_model_1.default.findOneAndDelete({ _id: id, createdBy: userId });
};
exports.deleteCategory = deleteCategory;
