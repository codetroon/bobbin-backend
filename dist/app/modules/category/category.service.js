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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const findExisting = yield prisma_1.default.category.findUnique({
        where: {
            name: categoryData.name,
        },
    });
    if (findExisting) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Category with this name already exists.");
    }
    const newCategory = yield prisma_1.default.category.create({
        data: categoryData,
        include: {
            Product: true,
        },
    });
    return newCategory;
});
const getAllCategories = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            name: {
                contains: searchTerm,
                mode: "insensitive",
            },
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.category.findMany({
        include: {
            Product: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.category.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            Product: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return result;
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // If updating name, check if it already exists
    if (payload.name && payload.name !== result.name) {
        const existingCategory = yield prisma_1.default.category.findUnique({
            where: {
                name: payload.name,
            },
        });
        if (existingCategory) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "Category with this name already exists.");
        }
    }
    const updatedCategory = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data: payload,
        include: {
            Product: true,
        },
    });
    return updatedCategory;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Check if category has associated products
    const associatedProducts = yield prisma_1.default.product.findMany({
        where: {
            categoryId: id,
        },
    });
    if (associatedProducts.length > 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete category that has associated products");
    }
    const deletedCategory = yield prisma_1.default.category.delete({
        where: {
            id,
        },
        include: {
            Product: true,
        },
    });
    return deletedCategory;
});
exports.CategoryService = {
    addCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
