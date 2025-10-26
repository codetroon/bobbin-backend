import { Category, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces";
import prisma from "../../../shared/prisma";

type ICategoryFilterRequest = {
  searchTerm?: string;
};

type ICreateCategoryData = Omit<Category, "id" | "createdAt" | "updatedAt">;
type IUpdateCategoryData = Partial<ICreateCategoryData>;

const addCategory = async (
  categoryData: ICreateCategoryData,
): Promise<Category> => {
  const findExisting = await prisma.category.findUnique({
    where: {
      name: categoryData.name,
    },
  });

  if (findExisting) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Category with this name already exists.",
    );
  }

  const newCategory = await prisma.category.create({
    data: categoryData,
    include: {
      Product: true,
    },
  });
  return newCategory;
};

const getAllCategories = async (
  filters: ICategoryFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions: Prisma.CategoryWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    include: {
      Product: true,
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

  const total = await prisma.category.count({
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

const getSingleCategory = async (id: string): Promise<Category> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      Product: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

const updateCategory = async (
  id: string,
  payload: IUpdateCategoryData,
): Promise<Category> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  // If updating name, check if it already exists
  if (payload.name && payload.name !== result.name) {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: payload.name,
      },
    });

    if (existingCategory) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Category with this name already exists.",
      );
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
    include: {
      Product: true,
    },
  });

  return updatedCategory;
};

const deleteCategory = async (id: string): Promise<Category> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Check if category has associated products
  const associatedProducts = await prisma.product.findMany({
    where: {
      categoryId: id,
    },
  });

  if (associatedProducts.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category that has associated products",
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
    include: {
      Product: true,
    },
  });

  return deletedCategory;
};

export const CategoryService = {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
