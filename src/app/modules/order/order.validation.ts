import { z } from "zod";

const createOrderZodSchema = z.object({
  body: z.object({
    customerName: z.string({
      required_error: "Customer name is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    contactNumber: z.string({
      required_error: "Contact number is required",
    }),
    productId: z.string({
      required_error: "Product ID is required",
    }),
    size: z.string({
      required_error: "Size is required",
    }),
    quantity: z
      .number({
        required_error: "Quantity is required",
      })
      .int()
      .positive("Quantity must be positive"),
    totalPrice: z
      .number({
        required_error: "Total price is required",
      })
      .positive("Total price must be positive"),
    status: z.string({
      required_error: "Order status is required",
    }),
  }),
});

const updateOrderZodSchema = z.object({
  body: z.object({
    customerName: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    productId: z.string().optional(),
    size: z.string().optional(),
    quantity: z.number().int().positive("Quantity must be positive").optional(),
    totalPrice: z.number().positive("Total price must be positive").optional(),
    status: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
