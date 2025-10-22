"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatValidation = void 0;
const zod_1 = require("zod");
const getChatHistorySchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, "Room ID is required"),
    }),
});
const getChatHistoryBetweenUsersSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
        sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    }),
});
const getChatRoomsForUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
    }),
});
const getSellerDetailsSchema = zod_1.z.object({
    params: zod_1.z.object({
        sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    }),
});
const generateRoomIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid("Invalid user ID"),
        sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    }),
});
// Socket events validation (for reference)
const sendMessageSchema = zod_1.z.object({
    senderId: zod_1.z.string().uuid("Invalid sender ID"),
    receiverId: zod_1.z.string().uuid("Invalid receiver ID"),
    message: zod_1.z
        .string()
        .min(1, "Message cannot be empty")
        .max(1000, "Message too long"),
    senderRole: zod_1.z.enum(["user", "seller"], {
        required_error: "Sender role is required",
    }),
});
const joinRoomSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid("Invalid user ID"),
    sellerId: zod_1.z.string().uuid("Invalid seller ID"),
    userRole: zod_1.z.enum(["user", "seller"], {
        required_error: "User role is required",
    }),
});
exports.ChatValidation = {
    getChatHistorySchema,
    getChatHistoryBetweenUsersSchema,
    getChatRoomsForUserSchema,
    getSellerDetailsSchema,
    generateRoomIdSchema,
    sendMessageSchema,
    joinRoomSchema,
};
