"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const seller_controller_1 = require("./seller.controller");
const seller_validation_1 = require("./seller.validation");
const router = express_1.default.Router();
router.post("/create-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.user), (0, validateRequest_1.default)(seller_validation_1.SellerValidation.createSellerProfileSchema), seller_controller_1.SellerController.createSellerProfile);
router.get("/my-parts", (0, auth_1.default)(userRoles_1.USER_ROLES.seller), seller_controller_1.SellerController.getMyParts);
router.patch("/update-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(seller_validation_1.SellerValidation.updateSellerProfileSchema), seller_controller_1.SellerController.updateSellerProfile);
router.delete("/delete-profile", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), seller_controller_1.SellerController.deleteSellerProfile);
exports.SellerRoutes = router;
