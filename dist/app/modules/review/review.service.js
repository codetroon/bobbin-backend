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
exports.ReviewService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Create a new review
const createReview = (userId, reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const { partId, orderId, rating, comment, title, images } = reviewData;
    // Check if part exists
    const part = yield prisma_1.default.part.findUnique({
        where: { id: partId, isDeleted: false },
    });
    if (!part) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Part not found");
    }
    // Check if user already reviewed this part
    const existingReview = yield prisma_1.default.review.findUnique({
        where: {
            userId_partId: {
                userId,
                partId,
            },
        },
    });
    if (existingReview) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You have already reviewed this product");
    }
    // If orderId is provided, verify it's a valid order by the user for this part
    let isVerifiedPurchase = false;
    if (orderId) {
        const order = yield prisma_1.default.order.findFirst({
            where: {
                id: orderId,
                userId,
                items: {
                    some: {
                        partId,
                    },
                },
            },
        });
        if (order) {
            isVerifiedPurchase = true;
        }
    }
    // Create the review
    const review = yield prisma_1.default.review.create({
        data: {
            userId,
            partId,
            orderId: orderId || null,
            rating,
            comment: comment || null,
            title: title || null,
            images: images || [],
            isVerified: isVerifiedPurchase,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePicture: true,
                },
            },
            part: {
                select: {
                    id: true,
                    title: true,
                    images: true,
                },
            },
        },
    });
    // Update part's average rating
    yield updatePartRating(partId);
    return review;
});
// Get reviews with filtering and pagination
const getReviews = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { partId, userId, rating, isVerified, status, searchTerm } = filters;
    const whereConditions = {
        status: status || client_1.ReviewStatus.active,
    };
    if (partId) {
        whereConditions.partId = partId;
    }
    if (userId) {
        whereConditions.userId = userId;
    }
    if (rating) {
        whereConditions.rating = rating;
    }
    if (isVerified !== undefined) {
        whereConditions.isVerified = isVerified;
    }
    if (searchTerm) {
        whereConditions.OR = [
            {
                comment: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
        ];
    }
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    const reviews = yield prisma_1.default.review.findMany({
        where: whereConditions,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePicture: true,
                },
            },
            part: {
                select: {
                    id: true,
                    title: true,
                    images: true,
                },
            },
        },
        orderBy,
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.review.count({
        where: whereConditions,
    });
    return {
        data: reviews,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
// Get a single review by ID
const getReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: {
            id: reviewId,
            status: client_1.ReviewStatus.active,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePicture: true,
                },
            },
            part: {
                select: {
                    id: true,
                    title: true,
                    images: true,
                },
            },
        },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return review;
});
// Update review (only by the review owner)
const updateReview = (reviewId, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingReview = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!existingReview) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    if (existingReview.userId !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only update your own reviews");
    }
    const updatedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePicture: true,
                },
            },
            part: {
                select: {
                    id: true,
                    title: true,
                    images: true,
                },
            },
        },
    });
    // Update part's average rating if rating was changed
    if (updateData.rating) {
        yield updatePartRating(existingReview.partId);
    }
    return updatedReview;
});
// Delete review (soft delete)
const deleteReview = (reviewId_1, userId_1, ...args_1) => __awaiter(void 0, [reviewId_1, userId_1, ...args_1], void 0, function* (reviewId, userId, isAdmin = false) {
    const existingReview = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!existingReview) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    if (!isAdmin && existingReview.userId !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only delete your own reviews");
    }
    yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: { status: client_1.ReviewStatus.deleted },
    });
    // Update part's average rating
    yield updatePartRating(existingReview.partId);
});
// Mark review as helpful
const markReviewHelpful = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: {
            helpfulCount: {
                increment: 1,
            },
        },
    });
});
// Report review
const reportReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    const updatedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: {
            reportedCount: {
                increment: 1,
            },
        },
    });
    // Auto-flag if reported too many times
    if (updatedReview.reportedCount >= 5) {
        yield prisma_1.default.review.update({
            where: { id: reviewId },
            data: { status: client_1.ReviewStatus.flagged },
        });
    }
});
// Get review statistics for a part
const getPartReviewStats = (partId) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield prisma_1.default.review.groupBy({
        by: ["rating"],
        where: {
            partId,
            status: client_1.ReviewStatus.active,
        },
        _count: {
            rating: true,
        },
    });
    const totalReviews = stats.reduce((sum, stat) => sum + stat._count.rating, 0);
    const averageRating = stats.reduce((sum, stat) => sum + stat.rating * stat._count.rating, 0) /
        totalReviews || 0;
    const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    };
    stats.forEach((stat) => {
        ratingDistribution[stat.rating] =
            stat._count.rating;
    });
    return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        ratingDistribution,
    };
});
// Admin functions
const moderateReview = (reviewId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: { status },
    });
    // Update part rating if review status changed
    yield updatePartRating(review.partId);
});
// Helper function to update part's average rating
const updatePartRating = (partId) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield getPartReviewStats(partId);
    yield prisma_1.default.part.update({
        where: { id: partId },
        data: {
            ratings: stats.averageRating,
        },
    });
});
exports.ReviewService = {
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
