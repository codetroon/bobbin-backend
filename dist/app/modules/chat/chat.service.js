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
exports.ChatService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
//  generate unique room ID for user-seller chat
const generateRoomId = (userId, sellerId) => {
    const ids = [userId, sellerId].sort();
    return `${ids[0]}_${ids[1]}`;
};
// save message to db
const saveMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.chat.create({
            data: {
                roomId: data.roomId,
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message,
                timestamp: data.timestamp || new Date(),
            },
        });
        return result;
    }
    catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
});
// get messages
const getChatHistory = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.chat.findMany({
        where: { roomId },
        orderBy: { timestamp: "asc" },
        // include: {
        //   sender: {
        //     select: {
        //       id: true,
        //       name: true,
        //       role: true,
        //       profilePicture: true,
        //     },
        //   },
        // },
    });
});
// get chat history between specific user and seller
const getChatHistoryBetweenUsers = (userId, sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = generateRoomId(userId, sellerId);
    return getChatHistory(roomId);
});
// get all chat rooms
const getChatRoomsForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield prisma_1.default.chat.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
        },
        select: {
            roomId: true,
            senderId: true,
            receiverId: true,
            message: true,
            timestamp: true,
        },
        orderBy: { timestamp: "desc" },
        distinct: ["roomId"],
    });
    // Group by room and get the other participant details
    const roomsMap = new Map();
    for (const chat of chats) {
        const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId;
        if (!roomsMap.has(chat.roomId)) {
            // Get other user details
            const otherUser = yield prisma_1.default.user.findUnique({
                where: { id: otherUserId },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    profilePicture: true,
                },
            });
            roomsMap.set(chat.roomId, {
                roomId: chat.roomId,
                otherUser,
                lastMessage: chat.message,
                lastMessageTime: chat.timestamp,
            });
        }
    }
    return Array.from(roomsMap.values());
});
exports.ChatService = {
    generateRoomId,
    saveMessage,
    getChatHistory,
    getChatHistoryBetweenUsers,
    getChatRoomsForUser,
};
