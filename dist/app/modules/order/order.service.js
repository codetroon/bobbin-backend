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
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const addOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify product exists
    const productExists = yield prisma_1.default.product.findUnique({
        where: { id: orderData.productId },
        include: {
            Size: true,
        },
    });
    if (!productExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Product not found");
    }
    // Find the size that was ordered
    const sizeRecord = productExists.Size.find((s) => s.name === orderData.size);
    if (!sizeRecord) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Size "${orderData.size}" not available for this product`);
    }
    // Check if sufficient stock is available
    if (sizeRecord.stock < orderData.quantity) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for size "${orderData.size}". Available: ${sizeRecord.stock}, Requested: ${orderData.quantity}`);
    }
    // Create order and update stock in a transaction
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the order
        const newOrder = yield tx.order.create({
            data: orderData,
            include: {
                products: {
                    include: {
                        category: true,
                        Size: true,
                    },
                },
            },
        });
        // Decrement the stock for the ordered size
        yield tx.size.update({
            where: {
                id: sizeRecord.id,
            },
            data: {
                stock: {
                    decrement: orderData.quantity,
                },
            },
        });
        return newOrder;
    }));
    return result;
});
const getAllOrders = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, status, productId } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    customerName: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    address: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    contactNumber: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }
    if (status) {
        andConditions.push({
            status,
        });
    }
    if (productId) {
        andConditions.push({
            productId,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
        include: {
            products: {
                include: {
                    category: true,
                    Size: true,
                },
            },
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
    const total = yield prisma_1.default.order.count({
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
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
        include: {
            products: {
                include: {
                    category: true,
                    Size: true,
                },
            },
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return result;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
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
    const updatedOrder = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data: payload,
        include: {
            products: {
                include: {
                    category: true,
                    Size: true,
                },
            },
        },
    });
    return updatedOrder;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const deletedOrder = yield prisma_1.default.order.delete({
        where: {
            id,
        },
        include: {
            products: {
                include: {
                    category: true,
                    Size: true,
                },
            },
        },
    });
    return deletedOrder;
});
exports.OrderService = {
    addOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};
