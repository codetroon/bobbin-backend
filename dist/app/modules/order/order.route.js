"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
// Public route - anyone can create an order
router.post("/", (0, validateRequest_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), order_controller_1.orderController.addOrder);
// Protected admin routes
// Get all orders with filtering
router.get("/", (0, auth_1.default)("super_admin", "admin"), order_controller_1.orderController.getAllOrders);
// Get single order
router.get("/:id", (0, auth_1.default)("super_admin", "admin"), order_controller_1.orderController.getSingleOrder);
// Update order
router.patch("/:id", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(order_validation_1.OrderValidation.updateOrderZodSchema), order_controller_1.orderController.updateOrder);
// Delete order
router.delete("/:id", (0, auth_1.default)("super_admin", "admin"), order_controller_1.orderController.deleteOrder);
exports.OrderRoutes = router;
