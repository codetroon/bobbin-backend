"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryValidation = void 0;
const zod_1 = require("zod");
const addSubCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Sub-category name is required"),
        categoryId: zod_1.z.string().uuid("Invalid category ID"),
    }),
});
const updateSubCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid sub-category ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
const getSubCategoryByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid sub-category ID"),
    }),
});
const deleteSubCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid sub-category ID"),
    }),
});
exports.SubCategoryValidation = {
    addSubCategorySchema,
    updateSubCategorySchema,
    getSubCategoryByIdSchema,
    deleteSubCategorySchema,
};
