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
exports.ChatController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const chat_service_1 = require("./chat.service");
// Get chat history between two users
const getChatHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const messages = yield chat_service_1.ChatService.getChatHistory(roomId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Chat history retrieved successfully",
        data: messages,
    });
}));
// Get chat history between user and seller
const getChatHistoryBetweenUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, sellerId } = req.params;
    const messages = yield chat_service_1.ChatService.getChatHistoryBetweenUsers(userId, sellerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Chat history retrieved successfully",
        data: messages,
    });
}));
// Get all chat rooms for a user
const getChatRoomsForUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const rooms = yield chat_service_1.ChatService.getChatRoomsForUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Chat rooms retrieved successfully",
        data: rooms,
    });
}));
// Get seller details for chat
const getSellerDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sellerId } = req.params;
    // TODO: Implement getSellerDetails in ChatService
    // const seller = await ChatService.getSellerDetails(sellerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Seller details retrieved successfully",
        data: { sellerId }, // Temporary response
    });
}));
// Generate room ID for user-seller chat
const generateRoomId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, sellerId } = req.params;
    const roomId = chat_service_1.ChatService.generateRoomId(userId, sellerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Room ID generated successfully",
        data: { roomId, userId, sellerId },
    });
}));
exports.ChatController = {
    getChatHistory,
    getChatHistoryBetweenUsers,
    getChatRoomsForUser,
    getSellerDetails,
    generateRoomId,
};
