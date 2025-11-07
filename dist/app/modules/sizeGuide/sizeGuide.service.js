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
exports.SizeGuideService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getSizeGuides = () => __awaiter(void 0, void 0, void 0, function* () {
    const sizeGuides = yield prisma_1.default.sizeGuide.findMany({
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return sizeGuides;
});
const getSizeGuideByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const sizeGuide = yield prisma_1.default.sizeGuide.findUnique({
        where: {
            categoryId,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return sizeGuide;
});
const createSizeGuide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if category exists
    const categoryExists = yield prisma_1.default.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!categoryExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    // Check if size guide already exists for this category
    const existingSizeGuide = yield prisma_1.default.sizeGuide.findUnique({
        where: { categoryId: payload.categoryId },
    });
    if (existingSizeGuide) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Size guide already exists for this category");
    }
    const sizeGuide = yield prisma_1.default.sizeGuide.create({
        data: payload,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return sizeGuide;
});
const updateSizeGuide = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if size guide exists
    const existingSizeGuide = yield prisma_1.default.sizeGuide.findUnique({
        where: { id },
    });
    if (!existingSizeGuide) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Size guide not found");
    }
    // If categoryId is being updated, check if it exists
    if (payload.categoryId) {
        const categoryExists = yield prisma_1.default.category.findUnique({
            where: { id: payload.categoryId },
        });
        if (!categoryExists) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
        }
        // Check if another size guide already exists for the new category
        if (payload.categoryId !== existingSizeGuide.categoryId) {
            const existingForCategory = yield prisma_1.default.sizeGuide.findUnique({
                where: { categoryId: payload.categoryId },
            });
            if (existingForCategory) {
                throw new ApiError_1.default(http_status_1.default.CONFLICT, "Size guide already exists for this category");
            }
        }
    }
    const sizeGuide = yield prisma_1.default.sizeGuide.update({
        where: { id },
        data: payload,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return sizeGuide;
});
const deleteSizeGuide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if size guide exists
    const existingSizeGuide = yield prisma_1.default.sizeGuide.findUnique({
        where: { id },
    });
    if (!existingSizeGuide) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Size guide not found");
    }
    yield prisma_1.default.sizeGuide.delete({
        where: { id },
    });
});
exports.SizeGuideService = {
    getSizeGuides,
    getSizeGuideByCategory,
    createSizeGuide,
    updateSizeGuide,
    deleteSizeGuide,
};
