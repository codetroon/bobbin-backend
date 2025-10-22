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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// approve and reject seller profile
const updateSellerProfileStatus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sellerId, status, }) {
    const seller = yield prisma_1.default.sellerProfile.findUnique({
        where: { id: sellerId },
    });
    if (!seller) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    if (seller.status !== "pending") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Cannot approve a seller in '${seller.status}' status`);
    }
    return prisma_1.default.sellerProfile.update({
        where: { id: sellerId },
        data: { status },
    });
});
// delete seller profile
const adminDeleteSellerProfile = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sellerId, status, }) {
    const seller = yield prisma_1.default.sellerProfile.findUnique({
        where: { id: sellerId },
    });
    if (!seller) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    if (seller.status !== "deletion_requested") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Deletion not requested by seller");
    }
    yield prisma_1.default.sellerProfile.update({
        where: { id: sellerId },
        data: { status },
    });
    return null;
});
exports.AdminService = {
    updateSellerProfileStatus,
    adminDeleteSellerProfile,
};
