"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const index_1 = __importDefault(require("./app/routes/index"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});
// middlewares
app.use(limiter);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
}));
// application routes
app.use("/api/v1", index_1.default);
app.get("/health", (req, res) => {
    res.send("Working fine !");
});
app.get("/", (req, res) => {
    res.send("Welcome to Bolt Parts API");
});
// Socket.io connection
// handleSocketConnection(io);
app.use(globalErrorHandler_1.default);
//Not Found
// app.use(notFound);
exports.default = app;
