"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartValidation = void 0;
const zod_1 = require("zod");
const addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
        partId: zod_1.z.string().uuid("Invalid part ID"),
        quantity: zod_1.z.number().int().positive("Quantity must be positive").default(1),
    }),
});
const updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid cart item ID"),
    }),
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().positive("Quantity must be positive"),
    }),
});
const getUserCartSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
const removeFromCartSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid cart item ID"),
    }),
});
exports.CartValidation = {
    addToCartSchema,
    updateCartItemSchema,
    getUserCartSchema,
    removeFromCartSchema,
};
