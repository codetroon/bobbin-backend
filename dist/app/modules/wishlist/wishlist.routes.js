"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const wishlist_controller_1 = require("./wishlist.controller");
const wishlist_validation_1 = require("./wishlist.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.user), (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.addToWishlistSchema), wishlist_controller_1.WishlistController.addToWishlist);
router.get("/", (0, auth_1.default)(userRoles_1.USER_ROLES.user), wishlist_controller_1.WishlistController.getWishlistItems);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.user), (0, validateRequest_1.default)(wishlist_validation_1.WishlistValidation.removeFromWishlistSchema), wishlist_controller_1.WishlistController.removeFromWishlist);
exports.WishlistRoutes = router;
