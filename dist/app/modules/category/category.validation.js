"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const addCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required"),
    }),
});
const updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid category ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required"),
    }),
});
const getCategoryByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid category ID"),
    }),
});
const deleteCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid category ID"),
    }),
});
exports.CategoryValidation = {
    addCategorySchema,
    updateCategorySchema,
    getCategoryByIdSchema,
    deleteCategorySchema,
};
