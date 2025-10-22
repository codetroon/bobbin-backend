"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
        totalPrice: zod_1.z.number().positive("Total price must be positive"),
        stripeSessionId: zod_1.z.string().optional(),
        paymentIntentId: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
            .default("pending"),
        items: zod_1.z
            .array(zod_1.z.object({
            partId: zod_1.z.string().uuid("Invalid part ID"),
            quantity: zod_1.z.number().int().positive("Quantity must be positive"),
            price: zod_1.z.number().positive("Price must be positive"),
        }))
            .min(1, "At least one item is required"),
    }),
});
const updateOrderStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid order ID"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"], {
            required_error: "Status is required",
        }),
    }),
});
const getOrderByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid order ID"),
    }),
});
const getUserOrdersSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
const getSellerOrdersSchema = zod_1.z.object({
    params: zod_1.z.object({
        sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    }),
});
exports.OrderValidation = {
    createOrderSchema,
    updateOrderStatusSchema,
    getOrderByIdSchema,
    getUserOrdersSchema,
    getSellerOrdersSchema,
};
