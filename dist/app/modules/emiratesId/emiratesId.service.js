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
exports.EmiratesIdService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// save emirates id info to db
const saveEmiratesId = (emiratesIdData) => __awaiter(void 0, void 0, void 0, function* () {
    const checkEmiratesId = yield prisma_1.default.emiratesId.findUnique({
        where: { emiratesIdNumber: emiratesIdData.emiratesIdNumber },
    });
    if (checkEmiratesId) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Emirates ID already exists");
    }
    return prisma_1.default.emiratesId.create({
        data: emiratesIdData,
    });
});
// retrieve emirates id info from db
const retriveEmiratesId = (emiratesIdNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const emiratesId = yield prisma_1.default.emiratesId.findUnique({
        where: { emiratesIdNumber },
    });
    return emiratesId;
});
// delete emirates id info from db
const deleteEmiratesId = (emiratesIdNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const emiratesId = yield prisma_1.default.emiratesId.findUnique({
        where: { emiratesIdNumber },
    });
    if (!emiratesId) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Emirates ID not found");
    }
    return prisma_1.default.emiratesId.delete({
        where: { emiratesIdNumber },
    });
});
exports.EmiratesIdService = {
    saveEmiratesId,
    retriveEmiratesId,
    deleteEmiratesId,
};
