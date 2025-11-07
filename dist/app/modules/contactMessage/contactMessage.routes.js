"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contactMessage_controller_1 = require("./contactMessage.controller");
const contactMessage_validation_1 = require("./contactMessage.validation");
const router = express_1.default.Router();
// Public route - anyone can submit a contact message
router.post("/", (0, validateRequest_1.default)(contactMessage_validation_1.ContactMessageValidation.createContactMessageZodSchema), contactMessage_controller_1.ContactMessageController.createContactMessage);
// Protected admin routes
router.get("/", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), contactMessage_controller_1.ContactMessageController.getContactMessages);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), contactMessage_controller_1.ContactMessageController.markAsRead);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), contactMessage_controller_1.ContactMessageController.deleteContactMessage);
exports.ContactMessageRoutes = router;
