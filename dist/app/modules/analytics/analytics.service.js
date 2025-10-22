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
exports.AnalyticsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Get overall sales analytics
const getSalesAnalytics = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = filters;
    const whereConditions = Object.assign(Object.assign({ status: "delivered" }, (startDate && {
        createdAt: Object.assign({ gte: new Date(startDate) }, (endDate && { lte: new Date(endDate) })),
    })), (endDate &&
        !startDate && {
        createdAt: {
            lte: new Date(endDate),
        },
    }));
    // Get current period data
    const orders = yield prisma_1.default.order.findMany({
        where: whereConditions,
        include: {
            items: {
                include: {
                    part: true,
                },
            },
        },
    });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalSales = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return {
        totalSales,
        totalRevenue,
        averageOrderValue,
        totalOrders,
        period: `${startDate || "Beginning"} to ${endDate || "Now"}`,
    };
});
// Get dashboard statistics
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalRevenueResult = yield prisma_1.default.order.aggregate({
        where: { status: "delivered" },
        _sum: { totalPrice: true },
    });
    const [totalOrders, totalUsers, totalSellers, totalParts, recentOrders, pendingOrders, completedOrders, cancelledOrders,] = yield Promise.all([
        prisma_1.default.order.count(),
        prisma_1.default.user.count({ where: { isDeleted: false } }),
        prisma_1.default.sellerProfile.count(),
        prisma_1.default.part.count({ where: { isDeleted: false } }),
        prisma_1.default.order.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        }),
        prisma_1.default.order.count({ where: { status: "pending" } }),
        prisma_1.default.order.count({ where: { status: "delivered" } }),
        prisma_1.default.order.count({ where: { status: "cancelled" } }),
    ]);
    return {
        totalRevenue: totalRevenueResult._sum.totalPrice || 0,
        totalOrders,
        totalUsers,
        totalSellers,
        totalParts,
        recentOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
    };
});
// Get seller analytics (simplified)
const getSellerAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield prisma_1.default.sellerProfile.findMany({
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            Part: {
                include: {
                    OrderItem: {
                        where: {
                            order: {
                                status: "delivered",
                            },
                        },
                    },
                    Review: {
                        where: {
                            status: "active",
                        },
                    },
                },
            },
        },
        take: 10,
    });
    return sellers.map((seller) => {
        const totalSales = seller.Part.reduce((sum, part) => sum +
            part.OrderItem.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const totalRevenue = seller.Part.reduce((sum, part) => sum +
            part.OrderItem.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);
        const totalOrders = seller.Part.reduce((sum, part) => sum + part.OrderItem.length, 0);
        const allReviews = seller.Part.flatMap((part) => part.Review);
        const averageRating = allReviews.length > 0
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
                allReviews.length
            : 0;
        const topSellingParts = seller.Part.map((part) => ({
            partId: part.id,
            partTitle: part.title,
            quantitySold: part.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
            revenue: part.OrderItem.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }))
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);
        return {
            sellerId: seller.id,
            sellerName: seller.user.name,
            storeName: seller.storeName,
            totalSales,
            totalRevenue,
            totalOrders,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: allReviews.length,
            topSellingParts,
        };
    });
});
// Get part analytics (simplified)
const getPartAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const parts = yield prisma_1.default.part.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            OrderItem: {
                where: {
                    order: {
                        status: "delivered",
                    },
                },
            },
            Review: {
                where: {
                    status: "active",
                },
            },
        },
        take: 10,
    });
    return parts.map((part) => {
        const totalSales = part.OrderItem.reduce((sum, item) => sum + item.quantity, 0);
        const totalRevenue = part.OrderItem.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const averageRating = part.Review.length > 0
            ? part.Review.reduce((sum, review) => sum + review.rating, 0) /
                part.Review.length
            : 0;
        return {
            partId: part.id,
            partTitle: part.title,
            totalSales,
            totalRevenue,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: part.Review.length,
        };
    });
});
// Get revenue breakdown (simplified)
const getRevenueBreakdown = () => __awaiter(void 0, void 0, void 0, function* () {
    // For now, return empty arrays - can be implemented with raw SQL later
    return {
        daily: [],
        monthly: [],
        yearly: [],
    };
});
// Get category analytics (simplified)
const getCategoryAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        include: {
            parts: {
                include: {
                    OrderItem: {
                        where: {
                            order: {
                                status: "delivered",
                            },
                        },
                    },
                },
            },
        },
    });
    return categories.map((category) => {
        const totalSales = category.parts.reduce((sum, part) => sum +
            part.OrderItem.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const totalRevenue = category.parts.reduce((sum, part) => sum +
            part.OrderItem.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);
        const topParts = category.parts
            .map((part) => ({
            partId: part.id,
            partTitle: part.title,
            sales: part.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
        }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
        return {
            categoryId: category.id,
            categoryName: category.name,
            totalSales,
            totalRevenue,
            marketShare: 0, // Can be calculated later
            topParts,
        };
    });
});
// Get top performers
const getTopPerformers = () => __awaiter(void 0, void 0, void 0, function* () {
    const [topSellers, topParts, topCategories] = yield Promise.all([
        getSellerAnalytics(),
        getPartAnalytics(),
        getCategoryAnalytics(),
    ]);
    return {
        topSellers: topSellers.slice(0, 5),
        topParts: topParts.slice(0, 5),
        topCategories: topCategories.slice(0, 5),
    };
});
exports.AnalyticsService = {
    getSalesAnalytics,
    getRevenueBreakdown,
    getSellerAnalytics,
    getPartAnalytics,
    getCategoryAnalytics,
    getDashboardStats,
    getTopPerformers,
};
