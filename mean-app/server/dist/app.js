"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger_1 = require("./swagger");
// ✅ Import route modules
const user_routes_1 = __importDefault(require("./api/modules/user/user.routes"));
const income_routes_1 = __importDefault(require("./api/modules/income/income.routes"));
const expense_routes_1 = __importDefault(require("./api/modules/expense/expense.routes"));
const dashboard_routes_1 = __importDefault(require("./api/modules/dashboard/dashboard.routes"));
const category_routes_1 = __importDefault(require("./api/modules/categories/category.routes"));
const taxEstimator_route_1 = __importDefault(require("./api/modules/taxEstimator/taxEstimator.route"));
const taxReminder_routes_1 = __importDefault(require("./api/modules/taxRemainders/taxReminder.routes"));
const reportexport_routes_1 = __importDefault(require("./api/modules/reportexport/reportexport.routes"));
const budget_routes_1 = __importDefault(require("./api/modules/budget/budget.routes"));
const report_routes_1 = __importDefault(require("./api/modules/reports/report.routes"));
// =========================================================
// ✅ Express App Setup
// =========================================================
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:4200",
        "https://taxpal-full-stack1-sh9q.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// =========================================================
// ✅ Swagger Setup
// =========================================================
(0, swagger_1.setupSwagger)(app);
// =========================================================
// ✅ API Routes
// =========================================================
// ✅ API Routes
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/tax-estimates", taxEstimator_route_1.default);
app.use("/api/v1/tax-reminders", taxReminder_routes_1.default);
app.use("/api/v1/budgets", budget_routes_1.default);
app.use("/api/v1/reports", report_routes_1.default);
app.use("/api/v1/reportexports", reportexport_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/income", income_routes_1.default);
app.use("/api/expense", expense_routes_1.default);
// =========================================================
// ✅ Angular Frontend Serving Logic
// =========================================================
const clientDistBase = path_1.default.resolve(__dirname, "../../client/dist");
function findIndexHtml(start, maxDepth = 6) {
    const stack = [{ dir: start, depth: 0 }];
    while (stack.length > 0) {
        const { dir, depth } = stack.pop();
        if (depth > maxDepth)
            continue;
        let entries = [];
        try {
            entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            continue;
        }
        for (const entry of entries) {
            const full = path_1.default.join(dir, entry.name);
            if (entry.isFile() && entry.name.toLowerCase() === "index.html") {
                return full;
            }
            if (entry.isDirectory()) {
                stack.push({ dir: full, depth: depth + 1 });
            }
        }
    }
    return null;
}
let clientPath = null;
try {
    const found = findIndexHtml(clientDistBase, 8);
    if (found) {
        clientPath = path_1.default.dirname(found);
        console.log("✅ Found frontend build at:", clientPath);
    }
}
catch (e) {
    console.warn("⚠️ Error while searching for frontend build:", e);
}
// =========================================================
// ✅ Serve Angular + Redirect Root to /login
// =========================================================
if (clientPath) {
    app.use(express_1.default.static(clientPath));
    // ✅ Redirect root ("/") to Angular /login route
    app.get("/", (req, res) => {
        res.redirect("/login");
    });
    // ✅ Angular routing fallback for SPA
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(clientPath, "index.html"));
    });
}
else {
    console.warn("⚠️ Frontend build not found.");
    console.warn("➡️ Run this command to build it:");
    console.warn("   cd client && ng build --configuration production");
}
// =========================================================
// ✅ Export App
// =========================================================
exports.default = app;
