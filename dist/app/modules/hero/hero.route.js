"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const hero_controller_1 = require("./hero.controller");
const hero_validation_1 = require("./hero.validation");
const router = express_1.default.Router();
// Public route - get hero settings
router.get("/", hero_controller_1.HeroController.getHeroSettings);
// Protected route - update hero settings (admin only)
router.patch("/:id", (0, auth_1.default)("super_admin", "admin"), (0, validateRequest_1.default)(hero_validation_1.HeroValidation.updateHeroSettings), hero_controller_1.HeroController.updateHeroSettings);
exports.HeroRoutes = router;
