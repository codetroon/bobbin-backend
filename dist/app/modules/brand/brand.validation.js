"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const addBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Brand name is required"),
    }),
});
const updateBrandSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid brand ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Brand name is required"),
    }),
});
const getBrandByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid brand ID"),
    }),
});
const deleteBrandSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid brand ID"),
    }),
});
exports.BrandValidation = {
    addBrandSchema,
    updateBrandSchema,
    getBrandByIdSchema,
    deleteBrandSchema,
};
