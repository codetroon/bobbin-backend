import { z } from "zod";

const createSizeZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Size name is required",
    }),
    stock: z
      .number({
        required_error: "Stock is required",
      })
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    productId: z.string({
      required_error: "Product ID is required",
    }),
  }),
});

const updateSizeZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    stock: z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative")
      .optional(),
    productId: z.string().optional(),
  }),
});

export const SizeValidation = {
  createSizeZodSchema,
  updateSizeZodSchema,
};
