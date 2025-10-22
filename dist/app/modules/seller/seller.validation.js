"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerValidation = void 0;
const zod_1 = require("zod");
const createSellerProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        storeName: zod_1.z.string().min(1, "Store name is required"),
        storeDescription: zod_1.z.string().optional(),
        paymentDetails: zod_1.z.string().optional(),
        documents: zod_1.z
            .array(zod_1.z.string().url("Invalid document URL"))
            .optional()
            .default([]),
        type: zod_1.z.enum(["NEW", "USED"], {
            required_error: "Business type is required",
        }),
    }),
});
const updateSellerProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        storeName: zod_1.z.string().min(1).optional(),
        storeDescription: zod_1.z.string().optional(),
        paymentDetails: zod_1.z.string().optional(),
        documents: zod_1.z.array(zod_1.z.string().url()).optional(),
        type: zod_1.z.enum(["NEW", "USED"]).optional(),
        // Status should not be updatable by sellers - only by admins
    }),
});
const updateSellerStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid seller ID"),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["pending", "approved", "rejected", "deletion_requested", "deleted"], {
            required_error: "Status is required",
        }),
    }),
});
exports.SellerValidation = {
    createSellerProfileSchema,
    updateSellerProfileSchema,
    updateSellerStatusSchema,
};
