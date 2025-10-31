"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIncome = void 0;
const income_model_1 = require("./income.model");
const addIncome = async (data, userId) => {
    const income = await income_model_1.Income.create({ ...data, userId });
    return {
        message: 'Income recorded successfully',
        income
    };
};
exports.addIncome = addIncome;
