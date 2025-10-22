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
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// add to wishlist
const addToWishlist = (wishlistItem) => __awaiter(void 0, void 0, void 0, function* () {
    const newWishlistItem = yield prisma_1.default.wishlist.create({
        data: wishlistItem,
    });
    return newWishlistItem;
});
// get wishlist by userId
const getWishlistByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistItems = yield prisma_1.default.wishlist.findMany({
        where: { userId },
    });
    return wishlistItems;
});
// remove item from wishlist
const removeFromWishlist = (userId, partId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.wishlist.deleteMany({
        where: { userId, partId, id: itemId },
    });
});
exports.default = {
    addToWishlist,
    getWishlistByUserId,
    removeFromWishlist,
};
