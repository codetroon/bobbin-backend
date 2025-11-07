"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeGuideValidation = void 0;
const zod_1 = require("zod");
const createSizeGuideZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .min(1, "Name cannot be empty"),
        imageUrl: zod_1.z
            .string({
            required_error: "Image URL is required",
        })
            .url("Invalid image URL"),
        categoryId: zod_1.z
            .string({
            required_error: "Category ID is required",
        })
            .uuid("Invalid category ID"),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
const updateSizeGuideZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        imageUrl: zod_1.z.string().url("Invalid image URL").optional(),
        categoryId: zod_1.z.string().uuid("Invalid category ID").optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.SizeGuideValidation = {
    createSizeGuideZodSchema,
    updateSizeGuideZodSchema,
};
