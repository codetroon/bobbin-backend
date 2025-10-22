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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createNotification = (notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.create({
        data: Object.assign(Object.assign({}, notificationData), { priority: notificationData.priority || client_1.Priority.normal }),
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return result;
});
const createBulkNotifications = (bulkData) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = bulkData.userIds.map((userId) => ({
        userId,
        title: bulkData.title,
        message: bulkData.message,
        type: bulkData.type,
        relatedId: bulkData.relatedId,
        priority: bulkData.priority || client_1.Priority.normal,
        actionUrl: bulkData.actionUrl,
    }));
    const result = yield prisma_1.default.notification.createMany({
        data: notifications,
    });
    return result;
});
const getAllNotifications = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, isRead, type, priority, startDate, endDate } = filters, filterData = __rest(filters, ["searchTerm", "isRead", "type", "priority", "startDate", "endDate"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    message: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }
    if (typeof isRead === "boolean") {
        andConditions.push({
            isRead: isRead,
        });
    }
    if (type) {
        andConditions.push({
            type: type,
        });
    }
    if (priority) {
        andConditions.push({
            priority: priority,
        });
    }
    if (startDate && endDate) {
        andConditions.push({
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        });
    }
    Object.entries(filterData).forEach(([field, value]) => {
        if (value !== undefined) {
            andConditions.push({
                [field]: value,
            });
        }
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.notification.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.notification.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getUserNotifications = (userId, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const userFilters = Object.assign(Object.assign({}, filters), { userId });
    return getAllNotifications(userFilters, options);
});
const getNotificationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return result;
});
const updateNotification = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.update({
        where: {
            id,
        },
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return result;
});
const markAsRead = (notificationIds) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.updateMany({
        where: {
            id: {
                in: notificationIds,
            },
        },
        data: {
            isRead: true,
        },
    });
    return result;
});
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
    return result;
});
const deleteNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.delete({
        where: {
            id,
        },
    });
    return result;
});
const deleteUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notification.deleteMany({
        where: {
            userId,
        },
    });
    return result;
});
const getNotificationStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const whereCondition = userId ? { userId } : {};
    const total = yield prisma_1.default.notification.count({
        where: whereCondition,
    });
    const unread = yield prisma_1.default.notification.count({
        where: Object.assign(Object.assign({}, whereCondition), { isRead: false }),
    });
    // Get stats by type
    const typeStats = yield prisma_1.default.notification.groupBy({
        by: ["type"],
        where: whereCondition,
        _count: {
            type: true,
        },
    });
    // Get stats by priority
    const priorityStats = yield prisma_1.default.notification.groupBy({
        by: ["priority"],
        where: whereCondition,
        _count: {
            priority: true,
        },
    });
    const byType = typeStats.reduce((acc, stat) => {
        acc[stat.type] = stat._count.type;
        return acc;
    }, {});
    const byPriority = priorityStats.reduce((acc, stat) => {
        acc[stat.priority] = stat._count.priority;
        return acc;
    }, {});
    return {
        total,
        unread,
        byType,
        byPriority,
    };
});
exports.NotificationService = {
    createNotification,
    createBulkNotifications,
    getAllNotifications,
    getUserNotifications,
    getNotificationById,
    updateNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteUserNotifications,
    getNotificationStats,
};
