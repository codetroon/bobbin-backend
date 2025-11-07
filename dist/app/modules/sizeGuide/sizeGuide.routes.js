"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeGuideRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const sizeGuide_controller_1 = require("./sizeGuide.controller");
const sizeGuide_validation_1 = require("./sizeGuide.validation");
const router = express_1.default.Router();
// Public routes
router.get("/category/:categoryId", sizeGuide_controller_1.SizeGuideController.getSizeGuideByCategory);
// Protected routes
router.get("/", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), sizeGuide_controller_1.SizeGuideController.getSizeGuides);
router.post("/", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(sizeGuide_validation_1.SizeGuideValidation.createSizeGuideZodSchema), sizeGuide_controller_1.SizeGuideController.createSizeGuide);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(sizeGuide_validation_1.SizeGuideValidation.updateSizeGuideZodSchema), sizeGuide_controller_1.SizeGuideController.updateSizeGuide);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.admin), sizeGuide_controller_1.SizeGuideController.deleteSizeGuide);
exports.SizeGuideRoutes = router;
