"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        phone: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL").optional(),
        role: zod_1.z
            .enum([
            "user",
            "seller",
            "verifier",
            "delivery_man",
            "admin",
            "super_admin",
        ])
            .optional(),
        isEmailVerified: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["active", "blocked", "pending"]).optional(),
        lastLogin: zod_1.z.coerce.date().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        verificationCode: zod_1.z.string().optional(),
        resetPasswordCode: zod_1.z.string().optional(),
        resetPasswordExpires: zod_1.z.coerce.date().optional(),
    }),
});
// update validation
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().min(6).optional(),
        phone: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL").optional(),
        role: zod_1.z
            .enum([
            "user",
            "seller",
            "verifier",
            "delivery_man",
            "admin",
            "super_admin",
        ])
            .optional(),
        isEmailVerified: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["active", "blocked", "pending"]).optional(),
        lastLogin: zod_1.z.coerce.date().optional(),
        isDeleted: zod_1.z.boolean().optional(),
        verificationCode: zod_1.z.string().optional(),
        resetPasswordCode: zod_1.z.string().optional(),
        resetPasswordExpires: zod_1.z.coerce.date().optional(),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required." }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: "Old password is required",
        }),
        newPassword: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
exports.AuthValidation = {
    registerUserSchema,
    updateUserSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
};
