"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.addCategorySchema), category_controller_1.CategoryController.addCategory);
router.get("/", category_controller_1.CategoryController.getAllCategories);
router.get("/:id", category_controller_1.CategoryController.getCategoryById);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(category_validation_1.CategoryValidation.updateCategorySchema), category_controller_1.CategoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
