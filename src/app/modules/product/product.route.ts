import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { productController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const router = express.Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);

// Protected routes - super_admin and admin can create, update, delete
router.post(
  "/",
  auth("super_admin", "admin"),
  validateRequest(ProductValidation.createProductZodSchema),
  productController.addProduct,
);

router.patch(
  "/:id",
  auth("super_admin", "admin"),
  validateRequest(ProductValidation.updateProductZodSchema),
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth("super_admin", "admin"),
  productController.deleteProduct,
);

export const ProductRoutes = router;
