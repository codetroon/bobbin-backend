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
exports.CartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add to cart
const addToCart = (userId, cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const findItems = yield prisma_1.default.cart.findFirstOrThrow({
        where: { partId: cartItem.partId, userId },
    });
    if (findItems) {
        return prisma_1.default.cart.update({
            where: { id: findItems.id },
            data: {
                quantity: findItems.quantity + 1,
            },
        });
    }
    else {
        const newCartItem = yield prisma_1.default.cart.create({
            data: Object.assign(Object.assign({}, cartItem), { userId }),
        });
        return newCartItem;
    }
});
// get cart items for a user
const getCartItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield prisma_1.default.cart.findMany({
        where: { userId },
    });
    return cartItems;
});
// remove item from cart
const removeFromCart = (userId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const findItem = yield prisma_1.default.cart.findUnique({
        where: { id: itemId },
    });
    if (!findItem || findItem.userId !== userId) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Item not found or does not belong to the user");
    }
    yield prisma_1.default.cart.delete({
        where: { userId, id: itemId },
    });
});
exports.CartService = {
    addToCart,
    getCartItems,
    removeFromCart,
};
