"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get("/profile", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.seller), user_controller_1.UserController.getUserProfile);
router.get("/all", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), user_controller_1.UserController.getAllUsersProfile);
router.patch("/update-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserProfileSchema), user_controller_1.UserController.updateUserProfile);
router.delete("/delete-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), user_controller_1.UserController.deleteUserProfile);
exports.UserRoutes = router;
