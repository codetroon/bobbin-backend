import { z } from "zod";

const createSizeGuideZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    imageUrl: z
      .string({
        required_error: "Image URL is required",
      })
      .url("Invalid image URL"),
    categoryId: z
      .string({
        required_error: "Category ID is required",
      })
      .uuid("Invalid category ID"),
    isActive: z.boolean().optional().default(true),
  }),
});

const updateSizeGuideZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
    categoryId: z.string().uuid("Invalid category ID").optional(),
    isActive: z.boolean().optional(),
  }),
});

export const SizeGuideValidation = {
  createSizeGuideZodSchema,
  updateSizeGuideZodSchema,
};
