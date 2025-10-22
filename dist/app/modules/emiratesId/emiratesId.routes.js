"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmiratesIdRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const emiratesId_controller_1 = require("./emiratesId.controller");
const emiratesId_validation_1 = require("./emiratesId.validation");
const router = express_1.default.Router();
router.post("/save", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), (0, validateRequest_1.default)(emiratesId_validation_1.EmiratesIdValidation.saveEmiratesIdZodSchema), emiratesId_controller_1.EmiratesIdController.saveEmiratesId);
router.get("/:emiratesIdNumber", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin), emiratesId_controller_1.EmiratesIdController.retriveEmiratesId);
router.delete("/:emiratesIdNumber", (0, auth_1.default)(userRoles_1.USER_ROLES.admin), emiratesId_controller_1.EmiratesIdController.deleteEmiratesId);
exports.EmiratesIdRoutes = router;
