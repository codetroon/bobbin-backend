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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUtils = void 0;
const client_1 = require("@prisma/client");
const notification_service_1 = require("./notification.service");
class NotificationUtils {
    // Order related notifications
    static notifyOrderPlaced(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Order Placed Successfully",
                message: "Your order has been placed successfully and is being processed.",
                type: client_1.NotificationType.ORDER_PLACED,
                relatedId: orderId,
                priority: client_1.Priority.normal,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyOrderConfirmed(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Order Confirmed",
                message: "Your order has been confirmed and will be shipped soon.",
                type: client_1.NotificationType.ORDER_CONFIRMED,
                relatedId: orderId,
                priority: client_1.Priority.high,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyOrderShipped(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Order Shipped",
                message: "Your order has been shipped and is on its way to you.",
                type: client_1.NotificationType.ORDER_SHIPPED,
                relatedId: orderId,
                priority: client_1.Priority.high,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyOrderDelivered(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Order Delivered",
                message: "Your order has been delivered successfully. Thank you for shopping with us!",
                type: client_1.NotificationType.ORDER_DELIVERED,
                relatedId: orderId,
                priority: client_1.Priority.normal,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyOrderCancelled(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Order Cancelled",
                message: "Your order has been cancelled. If you have any questions, please contact support.",
                type: client_1.NotificationType.ORDER_CANCELLED,
                relatedId: orderId,
                priority: client_1.Priority.high,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // Payment related notifications
    static notifyPaymentSuccess(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Payment Successful",
                message: "Your payment has been processed successfully.",
                type: client_1.NotificationType.PAYMENT_SUCCESS,
                relatedId: orderId,
                priority: client_1.Priority.high,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyPaymentFailed(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId,
                title: "Payment Failed",
                message: "Your payment could not be processed. Please try again or use a different payment method.",
                type: client_1.NotificationType.PAYMENT_FAILED,
                relatedId: orderId,
                priority: client_1.Priority.urgent,
                actionUrl: `/orders/${orderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // Part related notifications
    static notifyPartApproved(sellerId, partId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId: sellerId,
                title: "Part Approved",
                message: "Your part listing has been approved and is now live on the marketplace.",
                type: client_1.NotificationType.PART_APPROVED,
                relatedId: partId,
                priority: client_1.Priority.high,
                actionUrl: `/parts/${partId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyPartRejected(sellerId, partId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = reason
                ? `Your part listing has been rejected. Reason: ${reason}`
                : "Your part listing has been rejected. Please check the guidelines and resubmit.";
            const notification = {
                userId: sellerId,
                title: "Part Rejected",
                message,
                type: client_1.NotificationType.PART_REJECTED,
                relatedId: partId,
                priority: client_1.Priority.high,
                actionUrl: `/parts/${partId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    static notifyPartOutOfStock(sellerId, partId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId: sellerId,
                title: "Part Out of Stock",
                message: "One of your parts is now out of stock. Consider restocking to continue sales.",
                type: client_1.NotificationType.PART_OUT_OF_STOCK,
                relatedId: partId,
                priority: client_1.Priority.normal,
                actionUrl: `/parts/${partId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // Chat related notifications
    static notifyNewMessage(receiverId, senderId, messagePreview) {
        return __awaiter(this, void 0, void 0, function* () {
            const truncatedMessage = messagePreview.substring(0, 50);
            const message = `You have a new message: "${truncatedMessage}${messagePreview.length > 50 ? "..." : ""}"`;
            const notification = {
                userId: receiverId,
                title: "New Message",
                message,
                type: client_1.NotificationType.NEW_MESSAGE,
                relatedId: senderId,
                priority: client_1.Priority.normal,
                actionUrl: `/chat/${senderId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // Review related notifications
    static notifyReviewReceived(sellerId, partId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = {
                userId: sellerId,
                title: "New Review Received",
                message: `You received a ${rating}-star review on one of your parts.`,
                type: client_1.NotificationType.REVIEW_RECEIVED,
                relatedId: partId,
                priority: client_1.Priority.normal,
                actionUrl: `/parts/${partId}`,
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // Seller related notifications
    static notifySellerApplicationStatus(userId, status, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const isApproved = status === "approved";
            const message = isApproved
                ? "Congratulations! Your seller application has been approved. You can now start listing your parts."
                : `Your seller application has been rejected. ${reason
                    ? `Reason: ${reason}`
                    : "Please review the requirements and apply again."}`;
            const notification = {
                userId,
                title: `Seller Application ${isApproved ? "Approved" : "Rejected"}`,
                message,
                type: client_1.NotificationType.SELLER_APPLICATION_STATUS,
                priority: client_1.Priority.high,
                actionUrl: isApproved ? "/seller/dashboard" : "/seller/apply",
            };
            yield notification_service_1.NotificationService.createNotification(notification);
        });
    }
    // System notifications
    static notifySystemAnnouncement(userIds, title, message, actionUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulkNotification = {
                userIds,
                title,
                message,
                type: client_1.NotificationType.SYSTEM_ANNOUNCEMENT,
                priority: client_1.Priority.normal,
                actionUrl,
            };
            yield notification_service_1.NotificationService.createBulkNotifications(bulkNotification);
        });
    }
    static notifyPromotional(userIds, title, message, actionUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulkNotification = {
                userIds,
                title,
                message,
                type: client_1.NotificationType.PROMOTIONAL,
                priority: client_1.Priority.low,
                actionUrl,
            };
            yield notification_service_1.NotificationService.createBulkNotifications(bulkNotification);
        });
    }
}
exports.NotificationUtils = NotificationUtils;
