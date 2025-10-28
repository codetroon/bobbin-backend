"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeValidation = void 0;
const zod_1 = require("zod");
const createSizeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Size name is required",
        }),
        stock: zod_1.z
            .number({
            required_error: "Stock is required",
        })
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative"),
        productId: zod_1.z.string({
            required_error: "Product ID is required",
        }),
    }),
});
const updateSizeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        stock: zod_1.z
            .number()
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative")
            .optional(),
        productId: zod_1.z.string().optional(),
    }),
});
exports.SizeValidation = {
    createSizeZodSchema,
    updateSizeZodSchema,
};
