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
exports.BrandService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add brand to DB
const addBrand = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name }) {
    const newBrand = yield prisma_1.default.brand.create({
        data: {
            name,
        },
    });
    return newBrand;
});
// get all brands from DB
const getAllBrands = () => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield prisma_1.default.brand.findMany();
    return brands;
});
// get brand by id from DB
const getBrandById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield prisma_1.default.brand.findUnique({
        where: {
            id,
        },
    });
    return brand;
});
// update brand in DB
const updateBrand = (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { name }) {
    const updatedBrand = yield prisma_1.default.brand.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
    return updatedBrand;
});
// delete brand from DB
const deleteBrand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedBrand = yield prisma_1.default.brand.delete({
        where: {
            id,
        },
    });
    return deletedBrand;
});
exports.BrandService = {
    addBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};
