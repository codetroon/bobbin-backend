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
exports.ShopLicenseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// save shop license info to db
const saveShopLicense = (shopLicenseData) => __awaiter(void 0, void 0, void 0, function* () {
    const checkShopLicense = yield prisma_1.default.shopLicense.findUnique({
        where: { licenseNo: shopLicenseData.licenseNo },
    });
    if (checkShopLicense) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Shop License already exists");
    }
    return prisma_1.default.shopLicense.create({
        data: shopLicenseData,
    });
});
// retrieve shop license info from db
const retrieveShopLicense = (licenseNo) => __awaiter(void 0, void 0, void 0, function* () {
    const shopLicense = yield prisma_1.default.shopLicense.findUnique({
        where: { licenseNo },
    });
    return shopLicense;
});
// delete shop license info from db
const deleteShopLicense = (licenseNo) => __awaiter(void 0, void 0, void 0, function* () {
    const shopLicense = yield prisma_1.default.shopLicense.findUnique({
        where: { licenseNo },
    });
    if (!shopLicense) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop License not found");
    }
    return prisma_1.default.shopLicense.delete({
        where: { licenseNo },
    });
});
exports.ShopLicenseService = {
    saveShopLicense,
    retrieveShopLicense,
    deleteShopLicense,
};
