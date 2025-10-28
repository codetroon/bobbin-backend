"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string({
            required_error: "Customer name is required",
        }),
        address: zod_1.z.string({
            required_error: "Address is required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact number is required",
        }),
        productId: zod_1.z.string({
            required_error: "Product ID is required",
        }),
        totalPrice: zod_1.z
            .number({
            required_error: "Total price is required",
        })
            .positive("Total price must be positive"),
        status: zod_1.z.string({
            required_error: "Order status is required",
        }),
    }),
});
const updateOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        contactNumber: zod_1.z.string().optional(),
        productId: zod_1.z.string().optional(),
        totalPrice: zod_1.z.number().positive("Total price must be positive").optional(),
        status: zod_1.z.string().optional(),
    }),
});
exports.OrderValidation = {
    createOrderZodSchema,
    updateOrderZodSchema,
};
