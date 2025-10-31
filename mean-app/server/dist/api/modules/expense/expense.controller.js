"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpense = void 0;
const expense_service_1 = require("./expense.service");
const createExpense = async (req, res) => {
    try {
        const userId = req.user?.id;
        //const userId="68cbdd76325a0b6ac813c763";
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const expense = await (0, expense_service_1.addExpense)(userId, req.body);
        res.status(201).json({ message: "Expense recorded successfully", expense });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createExpense = createExpense;
