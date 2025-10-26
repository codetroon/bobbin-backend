import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { orderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = express.Router();

// All order routes require super_admin or admin authentication
// Get all orders with filtering
router.get("/", auth("super_admin", "admin"), orderController.getAllOrders);

// Get single order
router.get(
  "/:id",
  auth("super_admin", "admin"),
  orderController.getSingleOrder,
);

// Create new order
router.post(
  "/",
  auth("super_admin", "admin"),
  validateRequest(OrderValidation.createOrderZodSchema),
  orderController.addOrder,
);

// Update order
router.patch(
  "/:id",
  auth("super_admin", "admin"),
  validateRequest(OrderValidation.updateOrderZodSchema),
  orderController.updateOrder,
);

// Delete order
router.delete(
  "/:id",
  auth("super_admin", "admin"),
  orderController.deleteOrder,
);

export const OrderRoutes = router;
