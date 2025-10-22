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
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
const createNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.createNotification(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Notification created successfully!",
        data: result,
    });
}));
const createBulkNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.createBulkNotifications(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `${result.count} notifications created successfully!`,
        data: result,
    });
}));
const getAllNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        "searchTerm",
        "isRead",
        "type",
        "priority",
        "startDate",
        "endDate",
        "userId",
    ]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield notification_service_1.NotificationService.getAllNotifications(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notifications retrieved successfully!",
        data: result,
    });
}));
const getUserNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const filters = (0, pick_1.default)(req.query, [
        "searchTerm",
        "isRead",
        "type",
        "priority",
        "startDate",
        "endDate",
    ]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield notification_service_1.NotificationService.getUserNotifications(userId, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User notifications retrieved successfully!",
        data: result,
    });
}));
const getMyNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const filters = (0, pick_1.default)(req.query, [
        "searchTerm",
        "isRead",
        "type",
        "priority",
        "startDate",
        "endDate",
    ]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield notification_service_1.NotificationService.getUserNotifications(userId, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your notifications retrieved successfully!",
        data: result,
    });
}));
const getNotificationById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield notification_service_1.NotificationService.getNotificationById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification retrieved successfully!",
        data: result,
    });
}));
const updateNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield notification_service_1.NotificationService.updateNotification(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification updated successfully!",
        data: result,
    });
}));
const markAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationIds } = req.body;
    const result = yield notification_service_1.NotificationService.markAsRead(notificationIds);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${result.count} notifications marked as read!`,
        data: result,
    });
}));
const markMyNotificationAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    // First check if the notification belongs to the user
    const notification = yield notification_service_1.NotificationService.getNotificationById(id);
    if (!notification || notification.userId !== userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.FORBIDDEN,
            success: false,
            message: "You can only mark your own notifications as read!",
            data: null,
        });
    }
    const result = yield notification_service_1.NotificationService.updateNotification(id, {
        isRead: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification marked as read!",
        data: result,
    });
}));
const markAllAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield notification_service_1.NotificationService.markAllAsRead(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${result.count} notifications marked as read!`,
        data: result,
    });
}));
const deleteNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield notification_service_1.NotificationService.deleteNotification(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification deleted successfully!",
        data: result,
    });
}));
const deleteMyNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield notification_service_1.NotificationService.deleteUserNotifications(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${result.count} notifications deleted successfully!`,
        data: result,
    });
}));
const getNotificationStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const result = yield notification_service_1.NotificationService.getNotificationStats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification statistics retrieved successfully!",
        data: result,
    });
}));
const getMyNotificationStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield notification_service_1.NotificationService.getNotificationStats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your notification statistics retrieved successfully!",
        data: result,
    });
}));
exports.NotificationController = {
    createNotification,
    createBulkNotifications,
    getAllNotifications,
    getUserNotifications,
    getMyNotifications,
    getNotificationById,
    updateNotification,
    markAsRead,
    markMyNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMyNotifications,
    getNotificationStats,
    getMyNotificationStats,
};
