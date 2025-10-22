"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userRoles_1 = require("../../../enums/userRoles");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const part_controller_1 = require("./part.controller");
const part_validation_1 = require("./part.validation");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(part_validation_1.PartValidation.addPartSchema), part_controller_1.PartController.addPart);
router.get("/all", part_controller_1.PartController.getAllParts);
router.get("/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.user, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin, userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.verifier), (0, validateRequest_1.default)(part_validation_1.PartValidation.getPartByIdSchema), part_controller_1.PartController.getSinglePart);
router.patch("/update/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.seller), (0, validateRequest_1.default)(part_validation_1.PartValidation.updatePartSchema), part_controller_1.PartController.updatePart);
router.delete("/delete/:id", (0, auth_1.default)(userRoles_1.USER_ROLES.seller, userRoles_1.USER_ROLES.admin, userRoles_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(part_validation_1.PartValidation.deletePartSchema), part_controller_1.PartController.deletePart);
exports.PartRoutes = router;
