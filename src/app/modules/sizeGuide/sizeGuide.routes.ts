import express from "express";
import { USER_ROLES } from "../../../enums/userRoles";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SizeGuideController } from "./sizeGuide.controller";
import { SizeGuideValidation } from "./sizeGuide.validation";

const router = express.Router();

// Public routes
router.get("/category/:categoryId", SizeGuideController.getSizeGuideByCategory);

// Protected routes
router.get(
  "/",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  SizeGuideController.getSizeGuides,
);

router.post(
  "/",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  validateRequest(SizeGuideValidation.createSizeGuideZodSchema),
  SizeGuideController.createSizeGuide,
);

router.patch(
  "/:id",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  validateRequest(SizeGuideValidation.updateSizeGuideZodSchema),
  SizeGuideController.updateSizeGuide,
);

router.delete(
  "/:id",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  SizeGuideController.deleteSizeGuide,
);

export const SizeGuideRoutes = router;
