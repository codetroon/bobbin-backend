"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        partId: zod_1.z.string({
            required_error: "Part ID is required",
        }),
        orderId: zod_1.z.string().optional(),
        rating: zod_1.z
            .number({
            required_error: "Rating is required",
        })
            .int()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating must be at most 5"),
        comment: zod_1.z
            .string()
            .max(1000, "Comment must be at most 1000 characters")
            .optional(),
        title: zod_1.z
            .string()
            .max(100, "Title must be at most 100 characters")
            .optional(),
        images: zod_1.z.array(zod_1.z.string()).max(5, "Maximum 5 images allowed").optional(),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number()
            .int()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating must be at most 5")
            .optional(),
        comment: zod_1.z
            .string()
            .max(1000, "Comment must be at most 1000 characters")
            .optional(),
        title: zod_1.z
            .string()
            .max(100, "Title must be at most 100 characters")
            .optional(),
        images: zod_1.z.array(zod_1.z.string()).max(5, "Maximum 5 images allowed").optional(),
    }),
});
const getReviewsQueryZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        partId: zod_1.z.string().optional(),
        userId: zod_1.z.string().optional(),
        rating: zod_1.z
            .string()
            .transform((val) => (val ? parseInt(val) : undefined))
            .optional(),
        isVerified: zod_1.z
            .string()
            .transform((val) => val === "true")
            .optional(),
        status: zod_1.z.enum(["active", "hidden", "flagged", "deleted"]).optional(),
        sortBy: zod_1.z
            .enum(["createdAt", "rating", "helpfulCount"])
            .default("createdAt"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
        page: zod_1.z
            .string()
            .transform((val) => parseInt(val))
            .default("1"),
        limit: zod_1.z
            .string()
            .transform((val) => parseInt(val))
            .default("10"),
        searchTerm: zod_1.z.string().optional(),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema,
    getReviewsQueryZodSchema,
};
