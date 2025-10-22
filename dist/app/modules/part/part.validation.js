"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartValidation = void 0;
const zod_1 = require("zod");
const addPartSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        categoryId: zod_1.z.string().uuid("Invalid category ID"),
        subCategoryId: zod_1.z.string().uuid("Invalid sub-category ID"),
        brandId: zod_1.z.string().uuid("Invalid brand ID"),
        vehicleModelId: zod_1.z.string().uuid("Invalid vehicle model ID"),
        price: zod_1.z.number().positive("Price must be positive"),
        offerPrice: zod_1.z.number().positive().optional(),
        stock: zod_1.z.number().int().nonnegative("Stock must be non-negative"),
        condition: zod_1.z.enum(["NEW", "USED"], {
            required_error: "Condition is required",
        }),
        compatibility: zod_1.z.string().optional(),
        images: zod_1.z
            .array(zod_1.z.string().url("Invalid image URL"))
            .min(1, "At least one image is required"),
        documents: zod_1.z
            .array(zod_1.z.string().url("Invalid document URL"))
            .optional()
            .default([]),
        isVerified: zod_1.z.boolean().optional().default(false),
        isDeleted: zod_1.z.boolean().optional().default(false),
        isFeatured: zod_1.z.boolean().optional().default(false),
        isAvailable: zod_1.z.boolean().optional().default(true),
        variants: zod_1.z.record(zod_1.z.array(zod_1.z.string())).optional(),
    }),
});
const updatePartSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid part ID"),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        categoryId: zod_1.z.string().uuid().optional(),
        subCategoryId: zod_1.z.string().uuid().optional(),
        brandId: zod_1.z.string().uuid().optional(),
        vehicleModelId: zod_1.z.string().uuid().optional(),
        price: zod_1.z.number().positive().optional(),
        offerPrice: zod_1.z.number().positive().optional(),
        stock: zod_1.z.number().int().nonnegative().optional(),
        condition: zod_1.z.enum(["NEW", "USED"]).optional(),
        compatibility: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        documents: zod_1.z.array(zod_1.z.string().url()).optional(),
        isVerified: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        isAvailable: zod_1.z.boolean().optional(),
    }),
});
const getPartByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid part ID"),
    }),
});
const getPartsBySellerSchema = zod_1.z.object({
    params: zod_1.z.object({
        sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    }),
});
const deletePartSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid part ID"),
    }),
});
exports.PartValidation = {
    addPartSchema,
    updatePartSchema,
    getPartByIdSchema,
    getPartsBySellerSchema,
    deletePartSchema,
};
