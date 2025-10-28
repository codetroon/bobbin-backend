"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
// Public routes
router.get("/", product_controller_1.productController.getAllProducts);
router.get("/:id", product_controller_1.productController.getSingleProduct);
// Protected routes - super_admin and admin can create, update, delete
router.post("/", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(product_validation_1.ProductValidation.createProductZodSchema), product_controller_1.productController.addProduct);
router.patch("/:id", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(product_validation_1.ProductValidation.updateProductZodSchema), product_controller_1.productController.updateProduct);
router.delete("/:id", (0, auth_1.default)("super_admin", "admin"), product_controller_1.productController.deleteProduct);
exports.ProductRoutes = router;
