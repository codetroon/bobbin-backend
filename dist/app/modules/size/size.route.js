"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const size_controller_1 = require("./size.controller");
const size_validation_1 = require("./size.validation");
const router = express_1.default.Router();
// Public routes
router.get("/", size_controller_1.sizeController.getAllSizes);
router.get("/:id", size_controller_1.sizeController.getSingleSize);
// Protected routes - super_admin and admin can create, update, delete
router.post("/", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(size_validation_1.SizeValidation.createSizeZodSchema), size_controller_1.sizeController.addSize);
router.patch("/:id", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(size_validation_1.SizeValidation.updateSizeZodSchema), size_controller_1.sizeController.updateSize);
router.delete("/:id", (0, auth_1.default)("super_admin", "admin"), size_controller_1.sizeController.deleteSize);
exports.SizeRoutes = router;
