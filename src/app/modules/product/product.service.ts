import { Prisma, Product } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces";
import prisma from "../../../shared/prisma";

type IProductFilterRequest = {
  searchTerm?: string;
  categoryId?: string;
};

type ICreateProductData = Omit<Product, "id" | "createdAt" | "updatedAt">;
type IUpdateProductData = Partial<ICreateProductData>;

const addProduct = async (
  productData: ICreateProductData,
): Promise<Product> => {
  const findExisting = await prisma.product.findUnique({
    where: {
      productCode: productData.productCode,
    },
  });

  if (findExisting) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Product with this code already exists.",
    );
  }

  // Verify category exists
  const categoryExists = await prisma.category.findUnique({
    where: { id: productData.categoryId },
  });

  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const newProduct = await prisma.product.create({
    data: productData,
    include: {
      category: true,
      Size: true,
    },
  });
  return newProduct;
};

const getAllProducts = async (
  filters: IProductFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, categoryId } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          productCode: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    include: {
      category: true,
      Size: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleProduct = async (id: string): Promise<Product> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      Size: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  return result;
};

const updateProduct = async (
  id: string,
  payload: IUpdateProductData,
): Promise<Product> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // If updating productCode, check if it already exists
  if (payload.productCode && payload.productCode !== result.productCode) {
    const existingProduct = await prisma.product.findUnique({
      where: {
        productCode: payload.productCode,
      },
    });

    if (existingProduct) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Product with this code already exists.",
      );
    }
  }

  // If updating categoryId, verify category exists
  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!categoryExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Category not found");
    }
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
      Size: true,
    },
  });

  return updatedProduct;
};

const deleteProduct = async (id: string): Promise<Product> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check if product is associated with any orders
  const associatedOrders = await prisma.order.findMany({
    where: {
      productId: id,
    },
  });

  if (associatedOrders.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete product that has associated orders",
    );
  }

  const deletedProduct = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      category: true,
      Size: true,
    },
  });

  return deletedProduct;
};

export const ProductService = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
