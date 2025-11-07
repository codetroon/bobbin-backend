"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageValidation = void 0;
const zod_1 = require("zod");
const createContactMessageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .min(1, "Name cannot be empty"),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        message: zod_1.z
            .string({
            required_error: "Message is required",
        })
            .min(10, "Message must be at least 10 characters long"),
    }),
});
exports.ContactMessageValidation = {
    createContactMessageZodSchema,
};
