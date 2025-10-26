import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);

// Protected routes - super_admin and admin can create, update, delete
router.post(
  "/",
  auth("super_admin", "admin"),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  categoryController.addCategory,
);

router.patch(
  "/:id",
  auth("super_admin", "admin"),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  auth("super_admin", "admin"),
  categoryController.deleteCategory,
);

export const CategoryRoutes = router;
