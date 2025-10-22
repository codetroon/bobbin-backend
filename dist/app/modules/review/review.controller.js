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
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const review_service_1 = require("./review.service");
// Create a new review
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield review_service_1.ReviewService.createReview(user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Review created successfully",
        data: result,
    });
}));
// Get reviews with filtering and pagination
const getReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        "partId",
        "userId",
        "rating",
        "isVerified",
        "status",
        "searchTerm",
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield review_service_1.ReviewService.getReviews(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Reviews fetched successfully",
        data: result,
    });
}));
// Get a single review by ID
const getReviewById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const result = yield review_service_1.ReviewService.getReviewById(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review fetched successfully",
        data: result,
    });
}));
// Update a review
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const user = req.user;
    const result = yield review_service_1.ReviewService.updateReview(reviewId, user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review updated successfully",
        data: result,
    });
}));
// Delete a review
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const user = req.user;
    const isAdmin = user.role === "admin" || user.role === "super_admin";
    yield review_service_1.ReviewService.deleteReview(reviewId, user.userId, isAdmin);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review deleted successfully",
        data: null,
    });
}));
// Mark review as helpful
const markReviewHelpful = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    yield review_service_1.ReviewService.markReviewHelpful(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review marked as helpful successfully",
        data: null,
    });
}));
// Report a review
const reportReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    yield review_service_1.ReviewService.reportReview(reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review reported successfully",
        data: null,
    });
}));
// Get review statistics for a part
const getPartReviewStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partId } = req.params;
    const result = yield review_service_1.ReviewService.getPartReviewStats(partId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review statistics fetched successfully",
        data: result,
    });
}));
// Admin: Moderate a review
const moderateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { status } = req.body;
    yield review_service_1.ReviewService.moderateReview(reviewId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Review moderated successfully",
        data: null,
    });
}));
exports.ReviewController = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
    markReviewHelpful,
    reportReview,
    getPartReviewStats,
    moderateReview,
};
