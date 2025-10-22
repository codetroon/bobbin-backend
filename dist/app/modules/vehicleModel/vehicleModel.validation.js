"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModelValidation = void 0;
const zod_1 = require("zod");
const addVehicleModelSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Vehicle model name is required"),
        brandId: zod_1.z.string().uuid("Invalid brand ID"),
    }),
});
const updateVehicleModelSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid vehicle model ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        brandId: zod_1.z.string().uuid().optional(),
    }),
});
const getVehicleModelByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid vehicle model ID"),
    }),
});
const deleteVehicleModelSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid vehicle model ID"),
    }),
});
exports.VehicleModelValidation = {
    addVehicleModelSchema,
    updateVehicleModelSchema,
    getVehicleModelByIdSchema,
    deleteVehicleModelSchema,
};
