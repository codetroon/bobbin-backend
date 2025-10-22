"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cart_controller_1 = require("./cart.controller");
const cart_validation_1 = require("./cart.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.user), (0, validateRequest_1.default)(cart_validation_1.CartValidation.addToCartSchema), cart_controller_1.CartController.addToCart);
router.get("/", (0, auth_1.default)(userRoles_1.USER_ROLES.user), cart_controller_1.CartController.getCartItems);
router.delete("/:itemId", (0, auth_1.default)(userRoles_1.USER_ROLES.user), cart_controller_1.CartController.removeFromCart);
exports.CartRoutes = router;
