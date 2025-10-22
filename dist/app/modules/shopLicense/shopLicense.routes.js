"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopLicenseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shopLicense_controller_1 = require("./shopLicense.controller");
const shopLicense_validation_1 = require("./shopLicense.validation");
const router = express_1.default.Router();
router.post("/save", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(shopLicense_validation_1.saveShopLicenseZodSchema), shopLicense_controller_1.ShopLicenseController.saveShopLicense);
router.get("/:licenseNo", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(shopLicense_validation_1.retrieveShopLicenseZodSchema), shopLicense_controller_1.ShopLicenseController.retrieveShopLicense);
router.delete("/:licenseNo", (0, auth_1.default)(userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(shopLicense_validation_1.deleteShopLicenseZodSchema), shopLicense_controller_1.ShopLicenseController.deleteShopLicense);
exports.ShopLicenseRoutes = router;
