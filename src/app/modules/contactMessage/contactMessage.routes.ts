import express from "express";
import { USER_ROLES } from "../../../enums/userRoles";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ContactMessageController } from "./contactMessage.controller";
import { ContactMessageValidation } from "./contactMessage.validation";

const router = express.Router();

// Public route - anyone can submit a contact message
router.post(
  "/",
  validateRequest(ContactMessageValidation.createContactMessageZodSchema),
  ContactMessageController.createContactMessage,
);

// Protected admin routes
router.get(
  "/",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  ContactMessageController.getContactMessages,
);

router.patch(
  "/:id",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  ContactMessageController.markAsRead,
);

router.delete(
  "/:id",
  auth(USER_ROLES.super_admin, USER_ROLES.admin),
  ContactMessageController.deleteContactMessage,
);

export const ContactMessageRoutes = router;
