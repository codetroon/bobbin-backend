import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { sizeController } from "./size.controller";
import { SizeValidation } from "./size.validation";

const router = express.Router();

// Public routes
router.get("/", sizeController.getAllSizes);
router.get("/:id", sizeController.getSingleSize);

// Protected routes - super_admin and admin can create, update, delete
router.post(
  "/",
  auth("super_admin", "admin"),
  validateRequest(SizeValidation.createSizeZodSchema),
  sizeController.addSize,
);

router.patch(
  "/:id",
  auth("super_admin", "admin"),
  validateRequest(SizeValidation.updateSizeZodSchema),
  sizeController.updateSize,
);

router.delete("/:id", auth("super_admin", "admin"), sizeController.deleteSize);

export const SizeRoutes = router;
