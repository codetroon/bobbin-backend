"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsValidation = void 0;
const zod_1 = require("zod");
const getAnalyticsQueryZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        endDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        sellerId: zod_1.z.string().uuid().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
        partId: zod_1.z.string().uuid().optional(),
        period: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"]).default("monthly"),
        limit: zod_1.z
            .string()
            .transform((val) => parseInt(val))
            .default("10"),
    }),
});
const getSellerAnalyticsQueryZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        endDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        period: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"]).default("monthly"),
        sortBy: zod_1.z.enum(["revenue", "sales", "orders", "rating"]).default("revenue"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
        limit: zod_1.z
            .string()
            .transform((val) => parseInt(val))
            .default("10"),
    }),
});
const getPartAnalyticsQueryZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        endDate: zod_1.z
            .string()
            .datetime()
            .optional()
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        categoryId: zod_1.z.string().uuid().optional(),
        sellerId: zod_1.z.string().uuid().optional(),
        period: zod_1.z.enum(["daily", "weekly", "monthly", "yearly"]).default("monthly"),
        sortBy: zod_1.z
            .enum(["revenue", "sales", "rating", "reviews"])
            .default("revenue"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
        limit: zod_1.z
            .string()
            .transform((val) => parseInt(val))
            .default("10"),
    }),
});
exports.AnalyticsValidation = {
    getAnalyticsQueryZodSchema,
    getSellerAnalyticsQueryZodSchema,
    getPartAnalyticsQueryZodSchema,
};
