"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const analytics_controller_1 = require("./analytics.controller");
const analytics_validation_1 = require("./analytics.validation");
const router = express_1.default.Router();
// Admin and super admin routes
router.get("/sales", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getSalesAnalytics);
router.get("/dashboard", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), analytics_controller_1.AnalyticsController.getDashboardStats);
router.get("/sellers", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getSellerAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getSellerAnalytics);
router.get("/parts", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getPartAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getPartAnalytics);
router.get("/categories", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getCategoryAnalytics);
router.get("/revenue", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getRevenueBreakdown);
router.get("/top-performers", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), analytics_controller_1.AnalyticsController.getTopPerformers);
// Seller routes - sellers can view their own analytics
router.get("/my-analytics", (0, auth_1.default)(userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(analytics_validation_1.AnalyticsValidation.getAnalyticsQueryZodSchema), analytics_controller_1.AnalyticsController.getMyAnalytics);
exports.AnalyticsRoutes = router;
