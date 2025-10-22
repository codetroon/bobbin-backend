"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.post("/update-seller-profile-status", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), admin_controller_1.AdminController.updateSellerProfileStatus);
router.delete("/delete-seller-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), admin_controller_1.AdminController.adminDeleteSellerProfile);
exports.AdminRoutes = router;
