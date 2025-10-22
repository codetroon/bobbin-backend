"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const analytics_service_1 = require("./analytics.service");
// Get sales analytics
const getSalesAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        "startDate",
        "endDate",
        "sellerId",
        "categoryId",
        "partId",
        "period",
    ]);
    const result = yield analytics_service_1.AnalyticsService.getSalesAnalytics(filters);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Sales analytics fetched successfully",
        data: result,
    });
}));
// Get dashboard statistics
const getDashboardStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getDashboardStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard statistics fetched successfully",
        data: result,
    });
}));
// Get seller analytics
const getSellerAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getSellerAnalytics();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Seller analytics fetched successfully",
        data: result,
    });
}));
// Get part analytics
const getPartAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getPartAnalytics();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Part analytics fetched successfully",
        data: result,
    });
}));
// Get category analytics
const getCategoryAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getCategoryAnalytics();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category analytics fetched successfully",
        data: result,
    });
}));
// Get revenue breakdown
const getRevenueBreakdown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getRevenueBreakdown();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Revenue breakdown fetched successfully",
        data: result,
    });
}));
// Get top performers
const getTopPerformers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_service_1.AnalyticsService.getTopPerformers();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Top performers fetched successfully",
        data: result,
    });
}));
// Get seller's own analytics (for seller dashboard)
const getMyAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // Find seller profile
    const filters = (0, pick_1.default)(req.query, ["startDate", "endDate", "period"]);
    const result = yield analytics_service_1.AnalyticsService.getSalesAnalytics(Object.assign(Object.assign({}, filters), { sellerId: user.userId }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Your analytics fetched successfully",
        data: result,
    });
}));
exports.AnalyticsController = {
    getSalesAnalytics,
    getDashboardStats,
    getSellerAnalytics,
    getPartAnalytics,
    getCategoryAnalytics,
    getRevenueBreakdown,
    getTopPerformers,
    getMyAnalytics,
};
