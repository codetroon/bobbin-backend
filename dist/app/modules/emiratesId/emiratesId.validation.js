"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmiratesIdValidation = void 0;
const zod_1 = require("zod");
// Emirates ID validation patterns
const emiratesIdNumberPattern = /^784\d{12}$/; // 15 digits starting with 784
// Save Emirates ID validation schema
const saveEmiratesIdZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        emiratesIdNumber: zod_1.z
            .string({
            required_error: "Emirates ID number is required",
        })
            .regex(emiratesIdNumberPattern, {
            message: "Emirates ID must be 15 digits starting with 784",
        }),
        fullName: zod_1.z
            .string({
            required_error: "Full name is required",
        })
            .min(2, { message: "Full name must be at least 2 characters long" })
            .max(100, { message: "Full name cannot exceed 100 characters" }),
        nationality: zod_1.z
            .string({
            required_error: "Nationality is required",
        })
            .min(2, { message: "Nationality must be at least 2 characters long" })
            .max(50, { message: "Nationality cannot exceed 50 characters" }),
        dateOfBirth: zod_1.z
            .string({
            required_error: "Date of birth is required",
        })
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for date of birth",
        })
            .transform((val) => new Date(val)),
        gender: zod_1.z.enum(["male", "female"], {
            required_error: "Gender is required",
            invalid_type_error: "Gender must be either male or female",
        }),
        issueDate: zod_1.z
            .string({
            required_error: "Issue date is required",
        })
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for issue date",
        })
            .transform((val) => new Date(val)),
        expiryDate: zod_1.z
            .string({
            required_error: "Expiry date is required",
        })
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for expiry date",
        })
            .transform((val) => new Date(val)),
        idCardImage: zod_1.z
            .string()
            .url({ message: "ID card image must be a valid URL" })
            .optional(),
        backImage: zod_1.z
            .string()
            .url({ message: "Back image must be a valid URL" })
            .optional(),
    }),
});
// Retrieve Emirates ID validation schema
const retrieveEmiratesIdZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        emiratesIdNumber: zod_1.z
            .string({
            required_error: "Emirates ID number is required",
        })
            .regex(emiratesIdNumberPattern, {
            message: "Emirates ID must be 15 digits starting with 784",
        }),
    }),
});
// Delete Emirates ID validation schema
const deleteEmiratesIdZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        emiratesIdNumber: zod_1.z
            .string({
            required_error: "Emirates ID number is required",
        })
            .regex(emiratesIdNumberPattern, {
            message: "Emirates ID must be 15 digits starting with 784",
        }),
    }),
});
exports.EmiratesIdValidation = {
    deleteEmiratesIdZodSchema,
    retrieveEmiratesIdZodSchema,
    saveEmiratesIdZodSchema,
};
