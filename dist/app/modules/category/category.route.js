"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
// Public routes
router.get("/", category_controller_1.categoryController.getAllCategories);
router.get("/:id", category_controller_1.categoryController.getSingleCategory);
// Protected routes - super_admin and admin can create, update, delete
router.post("/", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.createCategoryZodSchema), category_controller_1.categoryController.addCategory);
router.patch("/:id", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.updateCategoryZodSchema), category_controller_1.categoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)("super_admin", "admin"), category_controller_1.categoryController.deleteCategory);
exports.CategoryRoutes = router;
