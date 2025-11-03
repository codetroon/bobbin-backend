import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { HeroController } from "./hero.controller";
import { HeroValidation } from "./hero.validation";

const router = express.Router();

// Public route - get hero settings
router.get("/", HeroController.getHeroSettings);

// Protected route - update hero settings (admin only)
router.patch(
  "/:id",
  auth("super_admin", "admin"),
  validateRequest(HeroValidation.updateHeroSettings),
  HeroController.updateHeroSettings,
);

export const HeroRoutes = router;
