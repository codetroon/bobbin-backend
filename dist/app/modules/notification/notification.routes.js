"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const notification_controller_1 = require("./notification.controller");
const notification_validation_1 = require("./notification.validation");
const router = express_1.default.Router();
// Public routes (for admin/system notifications)
router.post("/create", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.createNotificationZodSchema), notification_controller_1.NotificationController.createNotification);
router.post("/bulk-create", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.bulkNotificationZodSchema), notification_controller_1.NotificationController.createBulkNotifications);
router.get("/all", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.notificationFilterZodSchema), notification_controller_1.NotificationController.getAllNotifications);
router.get("/stats", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.getNotificationStats);
router.get("/user/:userId", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.notificationFilterZodSchema), notification_controller_1.NotificationController.getUserNotifications);
// User routes
router.get("/my-notifications", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.notificationFilterZodSchema), notification_controller_1.NotificationController.getMyNotifications);
router.get("/my-stats", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.getMyNotificationStats);
router.patch("/mark-all-read", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.markAllAsRead);
router.patch("/mark-read", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.markAsReadZodSchema), notification_controller_1.NotificationController.markAsRead);
router.delete("/my-notifications", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.deleteMyNotifications);
// Individual notification routes
router.get("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.getNotificationById);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.updateNotificationZodSchema), notification_controller_1.NotificationController.updateNotification);
router.patch("/:id/mark-read", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.markMyNotificationAsRead);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), notification_controller_1.NotificationController.deleteNotification);
exports.NotificationRoutes = router;
