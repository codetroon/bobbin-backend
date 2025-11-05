"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const index_1 = __importDefault(require("./app/routes/index"));
const app = (0, express_1.default)();
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(",")) || [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://bobbin-frontend.vercel.app",
        "https://www.bobbinapparels.com",
        "https://bobbinapparels.com",
        "https://bobbin.com.bd",
        "https://www.bobbin.com.bd",
    ],
    credentials: true,
}));
// Application routes
app.use("/api/v1", index_1.default);
// Health check endpoint (no CSRF protection)
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
    });
});
// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Bobbin API",
        version: "1.0.0",
        documentation: "/api/v1/docs",
    });
});
// Global error handler
app.use(globalErrorHandler_1.default);
// // 404 handler - catch all unmatched routes
// app.all("*", (req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: "API endpoint not found",
//     path: req.originalUrl,
//   });
// });
exports.default = app;
