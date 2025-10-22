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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResetMail_1 = require("../../../utils/sendResetMail");
// register user
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: userData.email,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already in use");
    }
    // hashing password
    userData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bycrypt_salt_rounds));
    // Create user in the database
    let createdUser;
    try {
        createdUser = yield prisma_1.default.user.create({
            data: userData,
        });
        const { id: userId, email, role } = createdUser;
        const token = jwtHelpers_1.jwtHelpers.createToken({ userId, email, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, email, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
        return { token, refreshToken };
    }
    catch (error) {
        //if there is an error during user creation
        if (createdUser) {
            yield prisma_1.default.user.delete({ where: { id: createdUser.id } });
        }
        throw error;
    }
});
// login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    // password matching
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, isUserExist.password);
    if (isUserExist.password && !isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const { id: userId, email, role } = isUserExist;
    const token = jwtHelpers_1.jwtHelpers.createToken({ userId, email, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, email, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        token,
        refreshToken,
    };
});
// refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify the token
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    if (!decodedToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token");
    }
    // Check if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: decodedToken.userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the user is already deleted
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is deleted!");
    }
    // Check if the user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // generate a new token
    const newToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        token: newToken,
    };
});
// change password
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userData.userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Checking if the user is already deleted
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is deleted!");
    }
    // Checking if the user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // Checking if the old password is correct
    const isPasswordCorrect = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Old password does not matched!");
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bycrypt_salt_rounds));
    // Update the user's password and related fields
    yield prisma_1.default.user.update({
        where: {
            id: userData.userId,
        },
        data: {
            password: newHashedPassword,
        },
    });
    return null;
});
// forget password
const forgetPassword = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // check if the user is already deleted
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is deleted!");
    }
    // check if the user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // JWT payload for the reset token
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    // create a JWT token that expires in 10 minutes
    const resetToken = jwtHelpers_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt.secret, "10m");
    // generate password reset link
    const passwordResetLink = `${config_1.default.reset_pass_ui_link}?token=${resetToken}`;
    // send the reset link to the user's email
    (0, sendResetMail_1.sendResetMail)(passwordResetLink, user);
    // log the reset link (for development/debugging purposes)
    // console.log(passwordResetLink);
});
// reset password
const resetPassword = (userId, token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify the reset token
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
    // Check if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    // Update the user's password
    yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            password: newHashedPassword,
        },
    });
    return null;
});
exports.AuthService = {
    registerUser,
    loginUser,
    refreshToken,
    changePassword,
    resetPassword,
    forgetPassword,
};
