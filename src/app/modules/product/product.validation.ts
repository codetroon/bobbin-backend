import { z } from "zod";

const createProductZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Product name is required",
    }),
    productCode: z.string({
      required_error: "Product code is required",
    }),
    description: z.string().optional(),
    price: z
      .number({
        required_error: "Price is required",
      })
      .positive("Price must be positive"),
    details: z.string().optional(),
    materials: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    categoryId: z.string({
      required_error: "Category ID is required",
    }),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    productCode: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive").optional(),
    details: z.string().optional(),
    materials: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
