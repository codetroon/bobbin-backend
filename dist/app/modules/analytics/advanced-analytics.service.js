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
exports.AdvancedAnalyticsService = exports.getConversionFunnel = exports.getRevenueForecast = exports.getInventoryInsights = exports.getTopCustomers = exports.getCustomerInsights = exports.getSalesTrends = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Enhanced reporting with more advanced analytics
// Get sales trends over time
const getSalesTrends = (period) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    let startDate;
    let groupBy;
    switch (period) {
        case "daily":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
            groupBy = "DATE(created_at)";
            break;
        case "weekly":
            startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // Last 12 weeks
            groupBy = "DATE_TRUNC('week', created_at)";
            break;
        case "monthly":
            startDate = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000); // Last 12 months
            groupBy = "DATE_TRUNC('month', created_at)";
            break;
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            groupBy = "DATE(created_at)";
    }
    const trends = yield prisma_1.default.$queryRawUnsafe(`
    SELECT 
      ${groupBy} as period,
      COUNT(*) as total_orders,
      SUM(total_price) as total_revenue,
      AVG(total_price) as avg_order_value,
      COUNT(DISTINCT user_id) as unique_customers
    FROM "Order"
    WHERE status = 'delivered' 
      AND created_at >= $1
    GROUP BY ${groupBy}
    ORDER BY period DESC
  `, startDate);
    return trends;
});
exports.getSalesTrends = getSalesTrends;
// Get customer insights
const getCustomerInsights = () => __awaiter(void 0, void 0, void 0, function* () {
    const insights = yield prisma_1.default.$queryRaw `
    SELECT 
      COUNT(DISTINCT o.user_id) as total_customers,
      AVG(customer_stats.order_count) as avg_orders_per_customer,
      AVG(customer_stats.total_spent) as avg_customer_value,
      MAX(customer_stats.total_spent) as highest_customer_value
    FROM (
      SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total_price) as total_spent
      FROM "Order"
      WHERE status = 'delivered'
      GROUP BY user_id
    ) customer_stats
    CROSS JOIN "Order" o
    WHERE o.status = 'delivered'
  `;
    return insights;
});
exports.getCustomerInsights = getCustomerInsights;
// Get top customers
const getTopCustomers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const topCustomers = yield prisma_1.default.$queryRaw `
    SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(o.id) as total_orders,
      SUM(o.total_price) as total_spent,
      AVG(o.total_price) as avg_order_value,
      MAX(o.created_at) as last_order_date
    FROM "User" u
    JOIN "Order" o ON u.id = o.user_id
    WHERE o.status = 'delivered'
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT ${limit}
  `;
    return topCustomers;
});
exports.getTopCustomers = getTopCustomers;
// Get inventory insights
const getInventoryInsights = () => __awaiter(void 0, void 0, void 0, function* () {
    const insights = yield prisma_1.default.part.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            title: true,
            stock: true,
            price: true,
            ratings: true,
            category: {
                select: {
                    name: true,
                },
            },
            seller: {
                select: {
                    storeName: true,
                },
            },
            OrderItem: {
                where: {
                    order: {
                        status: "delivered",
                    },
                },
                select: {
                    quantity: true,
                },
            },
        },
    });
    return insights.map((part) => {
        const totalSold = part.OrderItem.reduce((sum, item) => sum + item.quantity, 0);
        const turnoverRate = part.stock > 0 ? totalSold / part.stock : 0;
        return {
            partId: part.id,
            title: part.title,
            currentStock: part.stock,
            totalSold,
            turnoverRate,
            stockStatus: part.stock < 10
                ? "Low Stock"
                : part.stock < 50
                    ? "Medium Stock"
                    : "Good Stock",
            price: part.price,
            rating: part.ratings || 0,
            category: part.category.name,
            seller: part.seller.storeName,
        };
    });
});
exports.getInventoryInsights = getInventoryInsights;
// Get revenue forecasting (simple linear prediction)
const getRevenueForecast = () => __awaiter(void 0, void 0, void 0, function* () {
    const last6Months = yield prisma_1.default.$queryRaw `
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      SUM(total_price) as revenue
    FROM "Order"
    WHERE status = 'delivered' 
      AND created_at >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month ASC
  `;
    // Simple linear regression for next 3 months forecast
    const revenues = last6Months;
    if (revenues.length < 2) {
        return { forecast: [], trend: "insufficient_data" };
    }
    // Calculate trend
    const avgRevenue = revenues.reduce((sum, r) => sum + Number(r.revenue), 0) / revenues.length;
    const recentAvg = revenues.slice(-3).reduce((sum, r) => sum + Number(r.revenue), 0) / 3;
    const trend = recentAvg > avgRevenue ? "growing" : "declining";
    // Simple forecast (using average growth rate)
    const growthRate = revenues.length > 1
        ? (Number(revenues[revenues.length - 1].revenue) -
            Number(revenues[0].revenue)) /
            revenues.length
        : 0;
    const forecast = [];
    const lastRevenue = Number(revenues[revenues.length - 1].revenue);
    for (let i = 1; i <= 3; i++) {
        const predictedRevenue = Math.max(0, lastRevenue + growthRate * i);
        const futureMonth = new Date();
        futureMonth.setMonth(futureMonth.getMonth() + i);
        forecast.push({
            month: futureMonth.toISOString().slice(0, 7), // YYYY-MM format
            predictedRevenue,
            confidence: Math.max(0.5, 1 - i * 0.2), // Decreasing confidence
        });
    }
    return {
        historical: revenues,
        forecast,
        trend,
        avgGrowthRate: growthRate,
    };
});
exports.getRevenueForecast = getRevenueForecast;
// Get conversion funnel analytics
const getConversionFunnel = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, usersWithCarts, usersWithOrders, usersWithCompletedOrders,] = yield Promise.all([
        prisma_1.default.user.count({ where: { isDeleted: false } }),
        prisma_1.default.user.count({
            where: {
                isDeleted: false,
                Cart: { some: {} },
            },
        }),
        prisma_1.default.user.count({
            where: {
                isDeleted: false,
                Order: { some: {} },
            },
        }),
        prisma_1.default.user.count({
            where: {
                isDeleted: false,
                Order: { some: { status: "delivered" } },
            },
        }),
    ]);
    return {
        totalUsers,
        usersWithCarts,
        usersWithOrders,
        usersWithCompletedOrders,
        conversionRates: {
            cartConversion: totalUsers > 0 ? (usersWithCarts / totalUsers) * 100 : 0,
            orderConversion: usersWithCarts > 0 ? (usersWithOrders / usersWithCarts) * 100 : 0,
            completionRate: usersWithOrders > 0
                ? (usersWithCompletedOrders / usersWithOrders) * 100
                : 0,
            overallConversion: totalUsers > 0 ? (usersWithCompletedOrders / totalUsers) * 100 : 0,
        },
    };
});
exports.getConversionFunnel = getConversionFunnel;
exports.AdvancedAnalyticsService = {
    getSalesTrends: exports.getSalesTrends,
    getCustomerInsights: exports.getCustomerInsights,
    getTopCustomers: exports.getTopCustomers,
    getInventoryInsights: exports.getInventoryInsights,
    getRevenueForecast: exports.getRevenueForecast,
    getConversionFunnel: exports.getConversionFunnel,
};
