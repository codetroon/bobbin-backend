"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModelService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add vehicle model to DB
const addVehicleModel = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, brandId, }) {
    const newVehicleModel = yield prisma_1.default.vehicleModel.create({
        data: {
            name,
            brandId,
        },
    });
    return newVehicleModel;
});
// get all vehicle models from DB
const getAllVehicleModels = () => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleModels = yield prisma_1.default.vehicleModel.findMany({
        include: {
            brand: true,
        },
    });
    return vehicleModels;
});
// get vehicle model by id from DB
const getVehicleModelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleModel = yield prisma_1.default.vehicleModel.findUnique({
        where: {
            id: id,
        },
        include: {
            brand: true,
        },
    });
    return vehicleModel;
});
// update vehicle model in DB
const updateVehicleModel = (id, vehicleModelData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedVehicleModel = yield prisma_1.default.vehicleModel.update({
        where: {
            id: id,
        },
        data: {
            name: vehicleModelData.name,
            brandId: vehicleModelData.brandId,
        },
    });
    return updatedVehicleModel;
});
// delete vehicle model from DB
const deleteVehicleModel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedVehicleModel = yield prisma_1.default.vehicleModel.delete({
        where: {
            id: id,
        },
    });
    return deletedVehicleModel;
});
exports.VehicleModelService = {
    addVehicleModel,
    deleteVehicleModel,
    getAllVehicleModels,
    getVehicleModelById,
    updateVehicleModel,
};
