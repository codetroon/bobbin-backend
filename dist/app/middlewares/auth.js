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
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get token from header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Access token is required");
            }
            const token = authHeader.split(" ")[1];
            // Verify token
            let verifiedUser;
            try {
                verifiedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (error) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid access token");
            }
            // Check if user still exists
            const user = yield prisma_1.default.user.findUnique({
                where: { id: verifiedUser.userId },
                select: {
                    id: true,
                    role: true,
                },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User no longer exists");
            }
            // Check if user has required role
            if (requiredRoles.length && !requiredRoles.includes(user.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Insufficient permissions");
            }
            // Add user to request object
            req.user = {
                userId: user.id,
                role: user.role,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = auth;
