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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const chat_gateway_1 = require("./app/modules/chat/chat.gateway");
const config_1 = __importDefault(require("./config"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const httpServer = new http_1.Server(app_1.default);
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "*",
            },
            connectionStateRecovery: {},
        });
        // Handle Socket.IO connections for user-seller chat
        (0, chat_gateway_1.handleSocketConnection)(io);
        httpServer.listen(config_1.default.port, () => {
            console.info(`Server running on port ${config_1.default.port}`);
        });
        const exitHandler = () => {
            httpServer.close(() => {
                console.info("Server closed");
                process.exit(1);
            });
        };
        const unexpectedErrorHandler = (error) => {
            console.error(error);
            exitHandler();
        };
        process.on("uncaughtException", unexpectedErrorHandler);
        process.on("unhandledRejection", unexpectedErrorHandler);
        process.on("SIGTERM", () => {
            console.info("SIGTERM received");
            httpServer.close();
        });
    });
}
main();
