"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const updateUserProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        phone: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL").optional(),
        address: zod_1.z.string().optional(),
        // Password and email should not be updated through this endpoint
        // Use separate endpoints for those operations
    }),
});
const getUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
const deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
exports.UserValidation = {
    updateUserProfileSchema,
    getUserByIdSchema,
    deleteUserSchema,
};
