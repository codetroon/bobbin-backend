"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createNotificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "User ID is required",
        }),
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .min(1, "Title cannot be empty"),
        message: zod_1.z
            .string({
            required_error: "Message is required",
        })
            .min(1, "Message cannot be empty"),
        type: zod_1.z.nativeEnum(client_1.NotificationType, {
            required_error: "Notification type is required",
        }),
        relatedId: zod_1.z.string().optional(),
        priority: zod_1.z.nativeEnum(client_1.Priority).optional(),
        actionUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    }),
});
const updateNotificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        isRead: zod_1.z.boolean().optional(),
        title: zod_1.z.string().min(1, "Title cannot be empty").optional(),
        message: zod_1.z.string().min(1, "Message cannot be empty").optional(),
        actionUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    }),
});
const markAsReadZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        notificationIds: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one notification ID is required"),
    }),
});
const bulkNotificationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userIds: zod_1.z.array(zod_1.z.string()).min(1, "At least one user ID is required"),
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .min(1, "Title cannot be empty"),
        message: zod_1.z
            .string({
            required_error: "Message is required",
        })
            .min(1, "Message cannot be empty"),
        type: zod_1.z.nativeEnum(client_1.NotificationType, {
            required_error: "Notification type is required",
        }),
        relatedId: zod_1.z.string().optional(),
        priority: zod_1.z.nativeEnum(client_1.Priority).optional(),
        actionUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    }),
});
const notificationFilterZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        searchTerm: zod_1.z.string().optional(),
        isRead: zod_1.z
            .string()
            .transform((val) => val === "true")
            .optional(),
        type: zod_1.z.nativeEnum(client_1.NotificationType).optional(),
        priority: zod_1.z.nativeEnum(client_1.Priority).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    }),
});
exports.NotificationValidation = {
    createNotificationZodSchema,
    updateNotificationZodSchema,
    markAsReadZodSchema,
    bulkNotificationZodSchema,
    notificationFilterZodSchema,
};
