"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(userRoles_1.USER_ROLES.user), (0, validateRequest_1.default)(order_validation_1.OrderValidation.createOrderSchema), order_controller_1.OrderController.createOrder);
router.delete("/cancel/:orderId", (0, auth_1.default)(userRoles_1.USER_ROLES.user), order_controller_1.OrderController.cancelOrder);
exports.OrderRoutes = router;
