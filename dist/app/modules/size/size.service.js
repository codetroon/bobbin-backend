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
exports.SizeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addSize = (sizeData) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify product exists
    const productExists = yield prisma_1.default.product.findUnique({
        where: { id: sizeData.productId },
    });
    if (!productExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product not found");
    }
    // Check if size with same name already exists for this product
    const findExisting = yield prisma_1.default.size.findFirst({
        where: {
            name: sizeData.name,
            productId: sizeData.productId,
        },
    });
    if (findExisting) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Size with this name already exists for this product.");
    }
    const newSize = yield prisma_1.default.size.create({
        data: sizeData,
        include: {
            product: true,
        },
    });
    return newSize;
});
const getAllSizes = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, productId } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            name: {
                contains: searchTerm,
                mode: "insensitive",
            },
        });
    }
    if (productId) {
        andConditions.push({
            productId,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.size.findMany({
        include: {
            product: true,
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
    const total = yield prisma_1.default.size.count({
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
const getSingleSize = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.size.findUnique({
        where: {
            id,
        },
        include: {
            product: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Size not found");
    }
    return result;
});
const updateSize = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.size.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Size not found");
    }
    // If updating productId, verify product exists
    if (payload.productId) {
        const productExists = yield prisma_1.default.product.findUnique({
            where: { id: payload.productId },
        });
        if (!productExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product not found");
        }
    }
    // If updating name or productId, check for duplicates
    if (payload.name || payload.productId) {
        const checkName = payload.name || result.name;
        const checkProductId = payload.productId || result.productId;
        const existingSize = yield prisma_1.default.size.findFirst({
            where: {
                name: checkName,
                productId: checkProductId,
                id: {
                    not: id,
                },
            },
        });
        if (existingSize) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "Size with this name already exists for this product.");
        }
    }
    const updatedSize = yield prisma_1.default.size.update({
        where: {
            id,
        },
        data: payload,
        include: {
            product: true,
        },
    });
    return updatedSize;
});
const deleteSize = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.size.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Size not found");
    }
    const deletedSize = yield prisma_1.default.size.delete({
        where: {
            id,
        },
        include: {
            product: true,
        },
    });
    return deletedSize;
});
exports.SizeService = {
    addSize,
    getAllSizes,
    getSingleSize,
    updateSize,
    deleteSize,
};
