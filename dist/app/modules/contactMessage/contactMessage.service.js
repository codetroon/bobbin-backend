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
exports.ContactMessageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createContactMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const contactMessage = yield prisma_1.default.contactMessage.create({
        data: payload,
    });
    return contactMessage;
});
const getContactMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    const contactMessages = yield prisma_1.default.contactMessage.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return contactMessages;
});
const markAsRead = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMessage = yield prisma_1.default.contactMessage.findUnique({
        where: { id },
    });
    if (!existingMessage) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact message not found");
    }
    const contactMessage = yield prisma_1.default.contactMessage.update({
        where: { id },
        data: { isRead: true },
    });
    return contactMessage;
});
const deleteContactMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMessage = yield prisma_1.default.contactMessage.findUnique({
        where: { id },
    });
    if (!existingMessage) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Contact message not found");
    }
    yield prisma_1.default.contactMessage.delete({
        where: { id },
    });
});
exports.ContactMessageService = {
    createContactMessage,
    getContactMessages,
    markAsRead,
    deleteContactMessage,
};
