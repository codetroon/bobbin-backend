"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const subCategory_controller_1 = require("./subCategory.controller");
const subCategory_validation_1 = require("./subCategory.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(subCategory_validation_1.SubCategoryValidation.addSubCategorySchema), subCategory_controller_1.SubCategoryController.addSubCategory);
router.get("/", subCategory_controller_1.SubCategoryController.getAllSubCategories);
router.get("/:id", subCategory_controller_1.SubCategoryController.getSubCategoryById);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(subCategory_validation_1.SubCategoryValidation.updateSubCategorySchema), subCategory_controller_1.SubCategoryController.updateSubCategory);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), subCategory_controller_1.SubCategoryController.deleteSubCategory);
exports.SubCategoryRoutes = router;
