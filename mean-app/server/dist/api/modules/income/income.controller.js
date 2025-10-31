"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncome = void 0;
const income_service_1 = require("./income.service");
const createIncome = async (req, res) => {
    try {
        const userId = req.user.id; // <- Correct way
        //const userId="68cbdd76325a0b6ac813c763";
        const result = await (0, income_service_1.addIncome)(req.body, userId);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createIncome = createIncome;
