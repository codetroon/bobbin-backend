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
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const findExisting = yield prisma_1.default.product.findUnique({
        where: {
            productCode: productData.productCode,
        },
    });
    if (findExisting) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Product with this code already exists.");
    }
    // Verify category exists
    const categoryExists = yield prisma_1.default.category.findUnique({
        where: { id: productData.categoryId },
    });
    if (!categoryExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Category not found");
    }
    const newProduct = yield prisma_1.default.product.create({
        data: productData,
        include: {
            category: true,
            Size: true,
        },
    });
    return newProduct;
});
const getAllProducts = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, categoryId } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    productCode: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }
    if (categoryId) {
        andConditions.push({
            categoryId,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        include: {
            category: true,
            Size: true,
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
    const total = yield prisma_1.default.product.count({
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
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            Size: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return result;
});
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // If updating productCode, check if it already exists
    if (payload.productCode && payload.productCode !== result.productCode) {
        const existingProduct = yield prisma_1.default.product.findUnique({
            where: {
                productCode: payload.productCode,
            },
        });
        if (existingProduct) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "Product with this code already exists.");
        }
    }
    // If updating categoryId, verify category exists
    if (payload.categoryId) {
        const categoryExists = yield prisma_1.default.category.findUnique({
            where: { id: payload.categoryId },
        });
        if (!categoryExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Category not found");
        }
    }
    const updatedProduct = yield prisma_1.default.product.update({
        where: {
            id,
        },
        data: payload,
        include: {
            category: true,
            Size: true,
        },
    });
    return updatedProduct;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Check if product is associated with any orders
    const associatedOrders = yield prisma_1.default.order.findMany({
        where: {
            productId: id,
        },
    });
    if (associatedOrders.length > 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete product that has associated orders");
    }
    const deletedProduct = yield prisma_1.default.product.delete({
        where: {
            id,
        },
        include: {
            category: true,
            Size: true,
        },
    });
    return deletedProduct;
});
exports.ProductService = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
