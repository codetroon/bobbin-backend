"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
// Public routes
router.get("/", (0, validateRequest_1.default)(review_validation_1.ReviewValidation.getReviewsQueryZodSchema), review_controller_1.ReviewController.getReviews);
router.get("/stats/:partId", review_controller_1.ReviewController.getPartReviewStats);
router.get("/:reviewId", review_controller_1.ReviewController.getReviewById);
// Protected routes (require authentication)
router.post("/", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.ReviewController.createReview);
router.patch("/:reviewId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.updateReviewZodSchema), review_controller_1.ReviewController.updateReview);
router.delete("/:reviewId", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), review_controller_1.ReviewController.deleteReview);
router.post("/:reviewId/helpful", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), review_controller_1.ReviewController.markReviewHelpful);
router.post("/:reviewId/report", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.seller), review_controller_1.ReviewController.reportReview);
// Admin routes
router.patch("/:reviewId/moderate", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), review_controller_1.ReviewController.moderateReview);
exports.ReviewRoutes = router;
