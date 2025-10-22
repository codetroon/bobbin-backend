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
exports.handleSocketConnection = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const chat_service_1 = require("./chat.service");
// Store active users and their socket connections
const activeUsers = new Map();
const handleSocketConnection = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Handle connection with userId from query
        const userId = socket.handshake.query.userId;
        const userRole = socket.handshake.query.userRole || "user";
        if (userId) {
            const socketUser = {
                userId: userId,
                role: userRole,
                socketId: socket.id,
            };
            activeUsers.set(userId, socketUser);
            socket.userId = userId;
            socket.userRole = userRole;
            console.log(`User ${userId} (${userRole}) connected with socket ${socket.id}`);
            // Broadcast online users
            const onlineUsersList = Array.from(activeUsers.keys());
            io.emit("online_users", onlineUsersList);
            socket.broadcast.emit("user_online", userId);
        }
        // User authentication and registration
        socket.on("register_user", (userData) => {
            const socketUser = {
                userId: userData.userId,
                role: userData.role,
                socketId: socket.id,
            };
            activeUsers.set(userData.userId, socketUser);
            socket.userId = userData.userId;
            socket.userRole = userData.role;
            console.log(`User ${userData.userId} (${userData.role}) registered with socket ${socket.id}`);
            // Emit user status
            socket.emit("user_registered", {
                success: true,
                userId: userData.userId,
            });
            // Broadcast online users
            const onlineUsersList = Array.from(activeUsers.keys());
            io.emit("online_users", onlineUsersList);
            socket.broadcast.emit("user_online", userData.userId);
        });
        // Join chat room
        socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Join the room
                socket.join(roomId);
                console.log(`User ${socket.userId} joined room ${roomId}`);
                // Get chat history
                const chatHistory = yield chat_service_1.ChatService.getChatHistory(roomId);
                // Send chat history to the user
                socket.emit("chat_history", {
                    roomId,
                    messages: chatHistory,
                });
                // Notify other users in the room about the join
                socket.to(roomId).emit("user_joined_chat", {
                    userId: socket.userId,
                    userRole: socket.userRole,
                });
            }
            catch (error) {
                console.error("Error joining room:", error);
                socket.emit("error", { message: "Failed to join room" });
            }
        }));
        // Leave room
        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.userId} left room ${roomId}`);
        });
        // Join chat room between user and seller (keeping for backward compatibility)
        socket.on("join_user_seller_chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { userId, sellerId } = data;
                // Generate consistent room ID
                const roomId = chat_service_1.ChatService.generateRoomId(userId, sellerId);
                // Join the room
                socket.join(roomId);
                console.log(`User ${socket.userId} joined room ${roomId}`);
                // Get chat history
                const chatHistory = yield chat_service_1.ChatService.getChatHistoryBetweenUsers(userId, sellerId);
                // Send chat history to the user
                socket.emit("chat_history", {
                    roomId,
                    messages: chatHistory,
                });
                // Notify other user in the room about the join
                socket.to(roomId).emit("user_joined_chat", {
                    userId: socket.userId,
                    userRole: socket.userRole,
                });
            }
            catch (error) {
                console.error("Error joining chat:", error);
                socket.emit("error", { message: "Failed to join chat" });
            }
        }));
        // Send message (unified approach)
        socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("Received send_message event with data:", data);
                const { senderId, receiverId, roomId, message } = data;
                console.log("Extracted values:", {
                    senderId,
                    receiverId,
                    roomId,
                    message,
                });
                // Create message object
                const messageData = {
                    senderId,
                    receiverId,
                    roomId,
                    message,
                    timestamp: new Date(),
                };
                // Save message to database
                const savedMessage = yield chat_service_1.ChatService.saveMessage(messageData);
                // For now, send message without sender details to avoid relation issues
                const messageWithSender = Object.assign(Object.assign({}, savedMessage), { timestamp: savedMessage.timestamp.toISOString() });
                // Emit to all users in the room
                io.to(roomId).emit("receive_message", messageWithSender);
                console.log(`Message sent to room ${roomId}:`, messageWithSender);
                // Send push notification to receiver if they're offline
                const receiverSocket = activeUsers.get(receiverId);
                if (!receiverSocket) {
                    console.log(`User ${receiverId} is offline. Consider sending push notification.`);
                }
            }
            catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        }));
        // Send message in user-seller chat (keeping for backward compatibility)
        socket.on("send_user_seller_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { senderId, receiverId, message } = data;
                // Generate room ID
                const roomId = chat_service_1.ChatService.generateRoomId(senderId, receiverId);
                // Create message object
                const messageData = {
                    senderId,
                    receiverId,
                    roomId,
                    message,
                    timestamp: new Date(),
                };
                // Save message to database
                const savedMessage = yield chat_service_1.ChatService.saveMessage(messageData);
                // Get sender details for the message
                const sender = yield prisma_1.default.user.findUnique({
                    where: { id: senderId },
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        profilePicture: true,
                    },
                });
                const messageWithSender = Object.assign(Object.assign({}, savedMessage), { sender });
                // emit to all users in the room
                io.to(roomId).emit("receive_user_seller_message", messageWithSender);
                // Send push notification to receiver if they're offline
                const receiverSocket = activeUsers.get(receiverId);
                if (!receiverSocket) {
                    // You can implement push notification logic here
                    console.log(`User ${receiverId} is offline. Consider sending push notification.`);
                }
            }
            catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        }));
        // Get user's chat rooms
        socket.on("get_chat_rooms", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!socket.userId) {
                    socket.emit("error", { message: "User not authenticated" });
                    return;
                }
                const chatRooms = yield chat_service_1.ChatService.getChatRoomsForUser(socket.userId);
                socket.emit("chat_rooms", chatRooms);
            }
            catch (error) {
                console.error("Error getting chat rooms:", error);
                socket.emit("error", { message: "Failed to get chat rooms" });
            }
        }));
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            if (socket.userId) {
                activeUsers.delete(socket.userId);
                console.log(`User ${socket.userId} removed from active users`);
                // Broadcast user offline status
                const onlineUsersList = Array.from(activeUsers.keys());
                io.emit("online_users", onlineUsersList);
                socket.broadcast.emit("user_offline", socket.userId);
            }
        });
    });
};
exports.handleSocketConnection = handleSocketConnection;
