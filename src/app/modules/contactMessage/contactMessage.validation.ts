import { z } from "zod";

const createContactMessageZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    message: z
      .string({
        required_error: "Message is required",
      })
      .min(10, "Message must be at least 10 characters long"),
  }),
});

export const ContactMessageValidation = {
  createContactMessageZodSchema,
};
