"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Product name is required",
        }),
        productCode: zod_1.z.string({
            required_error: "Product code is required",
        }),
        description: zod_1.z.string().optional(),
        price: zod_1.z
            .number({
            required_error: "Price is required",
        })
            .positive("Price must be positive"),
        details: zod_1.z.string().optional(),
        materials: zod_1.z.array(zod_1.z.string()).default([]),
        colors: zod_1.z.array(zod_1.z.string()).default([]),
        images: zod_1.z.array(zod_1.z.string()).default([]),
        categoryId: zod_1.z.string({
            required_error: "Category ID is required",
        }),
    }),
});
const updateProductZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        productCode: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive("Price must be positive").optional(),
        details: zod_1.z.string().optional(),
        materials: zod_1.z.array(zod_1.z.string()).optional(),
        colors: zod_1.z.array(zod_1.z.string()).optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        categoryId: zod_1.z.string().optional(),
    }),
});
exports.ProductValidation = {
    createProductZodSchema,
    updateProductZodSchema,
};
