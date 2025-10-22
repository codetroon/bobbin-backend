"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const chat_controller_1 = require("./chat.controller");
const chat_validation_1 = require("./chat.validation");
const router = express_1.default.Router();
// Get chat history by room ID
router.get("/room/:roomId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(chat_validation_1.ChatValidation.getChatHistorySchema), chat_controller_1.ChatController.getChatHistory);
// Get chat history between user and seller
router.get("/between/:userId/:sellerId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(chat_validation_1.ChatValidation.getChatHistoryBetweenUsersSchema), chat_controller_1.ChatController.getChatHistoryBetweenUsers);
// Get all chat rooms for a user
router.get("/rooms/:userId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(chat_validation_1.ChatValidation.getChatRoomsForUserSchema), chat_controller_1.ChatController.getChatRoomsForUser);
// Get seller details for chat
router.get("/seller/:sellerId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(chat_validation_1.ChatValidation.getSellerDetailsSchema), chat_controller_1.ChatController.getSellerDetails);
// Generate room ID for user-seller chat
router.get("/room-id/:userId/:sellerId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(chat_validation_1.ChatValidation.generateRoomIdSchema), chat_controller_1.ChatController.generateRoomId);
exports.ChatRoutes = router;
