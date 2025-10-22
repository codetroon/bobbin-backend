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
exports.SellerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// create seller
const createSellerProfile = (userId, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            sellerProfile: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.sellerProfile) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Seller profile already requested or exists");
    }
    const profile = yield prisma_1.default.sellerProfile.create({
        data: profileData,
    });
    // make role as 'seller' and status as 'pending'
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            role: "seller",
            status: "pending",
        },
    });
    return profile;
});
// seller profile update
const updateSellerProfile = (userId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const seller = yield prisma_1.default.sellerProfile.findUnique({
        where: { userId },
    });
    if (!seller) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    // prevent status update by sellers
    if ("status" in updates || "type" in updates) {
        delete updates.status;
        delete updates.type;
    }
    const updatedSeller = yield prisma_1.default.sellerProfile.update({
        where: { userId },
        data: updates,
    });
    return updatedSeller;
});
// get my parts
const getMyParts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const seller = yield prisma_1.default.sellerProfile.findUnique({
        where: { userId },
        include: { Part: true },
    });
    if (!seller) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    return seller.Part;
});
// seller profile deletion
const requestSellerProfileDeletion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const seller = yield prisma_1.default.sellerProfile.findUnique({
        where: { userId },
    });
    if (!seller) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    if (seller.status === "deleted") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cannot perform this action");
    }
    if (seller.status === "deletion_requested") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Deletion request already submitted");
    }
    return prisma_1.default.sellerProfile.update({
        where: { id: seller.id },
        data: { status: "deletion_requested" },
    });
});
exports.SellerService = {
    createSellerProfile,
    updateSellerProfile,
    requestSellerProfileDeletion,
    getMyParts,
};
