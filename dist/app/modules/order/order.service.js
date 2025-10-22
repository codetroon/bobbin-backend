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
exports.OrderService = exports.updateOrderAfterPayment = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// create order
const createOrder = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const order = yield prisma_1.default.order.create({
        data: {
            userId,
            totalPrice,
            items: {
                create: items.map((item) => ({
                    partId: item.partId,
                    quantity: item.quantity,
                    price: item.totalPrice / item.quantity,
                })),
            },
        },
        include: {
            items: true,
        },
    });
    return order;
});
exports.createOrder = createOrder;
// update order
const updateOrderAfterPayment = (orderId, sessionId, paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.order.update({
        where: { id: orderId },
        data: {
            status: "paid",
            stripeSessionId: sessionId,
            paymentIntentId: paymentIntentId,
        },
    });
});
exports.updateOrderAfterPayment = updateOrderAfterPayment;
// cancel order
const cancelOrder = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkOrder = yield prisma_1.default.order.findUnique({
        where: { id: orderId },
    });
    if ((checkOrder === null || checkOrder === void 0 ? void 0 : checkOrder.userId) !== userId) {
        throw new Error("You are not authorized to cancel this order");
    }
    yield prisma_1.default.order.delete({
        where: { id: orderId },
    });
    return null;
});
exports.OrderService = {
    createOrder: exports.createOrder,
    cancelOrder,
};
