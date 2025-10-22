"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const brand_controller_1 = require("./brand.controller");
const brand_validation_1 = require("./brand.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(brand_validation_1.BrandValidation.addBrandSchema), brand_controller_1.BrandController.addBrand);
router.get("/", brand_controller_1.BrandController.getAllBrands);
router.get("/:id", brand_controller_1.BrandController.getBrandById);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(brand_validation_1.BrandValidation.updateBrandSchema), brand_controller_1.BrandController.updateBrand);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), brand_controller_1.BrandController.deleteBrand);
exports.BrandRoutes = router;
