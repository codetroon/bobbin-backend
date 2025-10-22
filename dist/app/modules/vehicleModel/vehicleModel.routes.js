"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vehicleModel_controller_1 = require("./vehicleModel.controller");
const vehicleModel_validation_1 = require("./vehicleModel.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(vehicleModel_validation_1.VehicleModelValidation.addVehicleModelSchema), vehicleModel_controller_1.VehicleModelController.addVehicleModel);
router.get("/", vehicleModel_controller_1.VehicleModelController.getAllVehicleModels);
router.get("/:id", vehicleModel_controller_1.VehicleModelController.getVehicleModelById);
router.patch("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(vehicleModel_validation_1.VehicleModelValidation.updateVehicleModelSchema), vehicleModel_controller_1.VehicleModelController.updateVehicleModel);
router.delete("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), vehicleModel_controller_1.VehicleModelController.deleteVehicleModel);
exports.VehicleModelRoutes = router;
