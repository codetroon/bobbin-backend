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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// fetch user profile
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            isDeleted: false,
        },
        include: {
            sellerProfile: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
// fetch all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        where: {
            isDeleted: false,
        },
    });
    if (users.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Users not found");
    }
    return users;
});
// update user profile
const updateUserProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    // remove sellerProfile from userData if present
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sellerProfile } = userData, rest = __rest(userData, ["sellerProfile"]);
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: userId,
            isDeleted: false,
        },
        data: Object.assign({}, rest),
    });
    return updatedUser;
});
// delete user profile
const deleteUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!user || user.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const deletedUser = yield prisma_1.default.user.update({
        where: {
            id: userId,
            isDeleted: false,
        },
        data: {
            isDeleted: true,
        },
    });
    return deletedUser;
});
exports.UserService = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
};
