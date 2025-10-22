"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShopLicenseZodSchema = exports.retrieveShopLicenseZodSchema = exports.saveShopLicenseZodSchema = void 0;
const zod_1 = require("zod");
// Shop License validation patterns
const licenseNumberPattern = /^[A-Z]{2}-\d{6}$/; // Format: CN-123456
// Save Shop License validation schema
const saveShopLicenseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        ownerName: zod_1.z
            .string({
            required_error: "Owner name is required",
        })
            .min(2, { message: "Owner name must be at least 2 characters long" })
            .max(100, { message: "Owner name cannot exceed 100 characters" }),
        nationality: zod_1.z
            .string({
            required_error: "Nationality is required",
        })
            .min(2, { message: "Nationality must be at least 2 characters long" })
            .max(50, { message: "Nationality cannot exceed 50 characters" }),
        licenseType: zod_1.z.enum(["business", "commercial", "professional", "industrial", "tourist"], {
            required_error: "License type is required",
            invalid_type_error: "Invalid license type",
        }),
        licenseCategory: zod_1.z.enum(["normal", "premium", "special", "temporary"], {
            required_error: "License category is required",
            invalid_type_error: "Invalid license category",
        }),
        licenseNo: zod_1.z
            .string({
            required_error: "License number is required",
        })
            .regex(licenseNumberPattern, {
            message: "License number must be in format XX-123456",
        }),
        expiryDate: zod_1.z
            .string({
            required_error: "Expiry date is required",
        })
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for expiry date",
        }),
        unifiedRegistrationNo: zod_1.z.string().optional(),
        unifiedLicenseNo: zod_1.z.string().optional(),
        establishmentDate: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for establishment date",
        })
            .optional(),
        issuanceDate: zod_1.z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format for issuance date",
        })
            .optional(),
        legalForm: zod_1.z.string().optional(),
        tradeName: zod_1.z.string().optional(),
        licenseActivity: zod_1.z.string().optional(),
        adcciNo: zod_1.z.string().optional(),
        mohreEstablishmentNo: zod_1.z.string().optional(),
        ownerAddress: zod_1.z.string().optional(),
        officialEmail: zod_1.z.string().email().optional(),
        officialMobile: zod_1.z.string().optional(),
        licenseImage: zod_1.z.string().url().optional(),
        backImage: zod_1.z.string().url().optional(),
    }),
});
exports.saveShopLicenseZodSchema = saveShopLicenseZodSchema;
// Retrieve Shop License validation schema
const retrieveShopLicenseZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        licenseNo: zod_1.z
            .string({
            required_error: "License number is required",
        })
            .regex(licenseNumberPattern, {
            message: "License number must be in format XX-123456",
        }),
    }),
});
exports.retrieveShopLicenseZodSchema = retrieveShopLicenseZodSchema;
// Delete Shop License validation schema
const deleteShopLicenseZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        licenseNo: zod_1.z
            .string({
            required_error: "License number is required",
        })
            .regex(licenseNumberPattern, {
            message: "License number must be in format XX-123456",
        }),
    }),
});
exports.deleteShopLicenseZodSchema = deleteShopLicenseZodSchema;
