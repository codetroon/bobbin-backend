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
exports.SubCategoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add subCategory to DB
const addSubCategory = (subCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const newSubCategory = yield prisma_1.default.subCategory.create({
        data: {
            name: subCategoryData.name,
            categoryId: subCategoryData.categoryId,
        },
    });
    return newSubCategory;
});
// get all subCategories from DB
const getAllSubCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const subCategories = yield prisma_1.default.subCategory.findMany();
    return subCategories;
});
// get subCategory by id from DB
const getSubCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield prisma_1.default.subCategory.findUnique({
        where: {
            id,
        },
    });
    return subCategory;
});
// update subCategory in DB
const updateSubCategory = (id_1, _a) => __awaiter(void 0, [id_1, _a], void 0, function* (id, { name }) {
    const updatedSubCategory = yield prisma_1.default.subCategory.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
    return updatedSubCategory;
});
// delete subCategory from DB
const deleteSubCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSubCategory = yield prisma_1.default.subCategory.delete({
        where: {
            id,
        },
    });
    return deletedSubCategory;
});
exports.SubCategoryService = {
    addSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
};
