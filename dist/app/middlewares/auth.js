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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        const { userId } = decoded;
        // Fetch user from database using Prisma
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        if (user.isDeleted) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is deleted!");
        }
        if (user.status === "blocked") {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
        }
        // // Check if password changed after token issued
        // if (
        //   user.passwordChangedAt &&
        //   iat &&
        //   new Date(user.passwordChangedAt).getTime() / 1000 > iat
        // ) {
        //   throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        // }
        // Check if user has required role
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // Attach decoded user info to the request
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
