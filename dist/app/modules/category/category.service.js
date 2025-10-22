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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add category to DB
const addCategory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, }) {
    const newCategory = yield prisma_1.default.category.create({
        data: {
            name,
        },
    });
    return newCategory;
});
// get all categories from DB
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany();
    return categories;
});
// get category by id from DB
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    return category;
});
// update category in DB
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCategory = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data: {
            name: data.name,
        },
    });
    return updatedCategory;
});
// delete category from DB
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCategory = yield prisma_1.default.category.delete({
        where: {
            id,
        },
    });
    return deletedCategory;
});
exports.CategoryService = {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
