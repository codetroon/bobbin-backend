"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistValidation = void 0;
const zod_1 = require("zod");
const addToWishlistSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
        partId: zod_1.z.string().uuid("Invalid part ID"),
    }),
});
const getUserWishlistSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
const removeFromWishlistSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid wishlist item ID"),
    }),
});
exports.WishlistValidation = {
    addToWishlistSchema,
    getUserWishlistSchema,
    removeFromWishlistSchema,
};
