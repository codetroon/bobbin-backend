"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const createAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Invalid email"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        phone: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL").optional(),
        role: zod_1.z.enum(["admin", "super_admin"], {
            required_error: "Admin role is required",
        }),
    }),
});
const updateAdminSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid admin ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        profilePicture: zod_1.z.string().url("Invalid URL").optional(),
        role: zod_1.z.enum(["admin", "super_admin"]).optional(),
        status: zod_1.z.enum(["active", "blocked", "pending"]).optional(),
    }),
});
const getAdminByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid admin ID"),
    }),
});
const deleteAdminSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid admin ID"),
    }),
});
exports.AdminValidation = {
    createAdminSchema,
    updateAdminSchema,
    getAdminByIdSchema,
    deleteAdminSchema,
};
