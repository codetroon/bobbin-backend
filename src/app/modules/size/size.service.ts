import { Prisma, Size } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces";
import prisma from "../../../shared/prisma";

type ISizeFilterRequest = {
  searchTerm?: string;
  productId?: string;
};

type ICreateSizeData = Omit<Size, "id" | "createdAt" | "updatedAt">;
type IUpdateSizeData = Partial<ICreateSizeData>;

const addSize = async (sizeData: ICreateSizeData): Promise<Size> => {
  // Verify product exists
  const productExists = await prisma.product.findUnique({
    where: { id: sizeData.productId },
  });

  if (!productExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  // Check if size with same name already exists for this product
  const findExisting = await prisma.size.findFirst({
    where: {
      name: sizeData.name,
      productId: sizeData.productId,
    },
  });

  if (findExisting) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Size with this name already exists for this product.",
    );
  }

  const newSize = await prisma.size.create({
    data: sizeData,
    include: {
      product: true,
    },
  });
  return newSize;
};

const getAllSizes = async (
  filters: ISizeFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, productId } = filters;

  const andConditions: Prisma.SizeWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (productId) {
    andConditions.push({
      productId,
    });
  }

  const whereConditions: Prisma.SizeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.size.findMany({
    include: {
      product: true,
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

  const total = await prisma.size.count({
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

const getSingleSize = async (id: string): Promise<Size> => {
  const result = await prisma.size.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Size not found");
  }

  return result;
};

const updateSize = async (
  id: string,
  payload: IUpdateSizeData,
): Promise<Size> => {
  const result = await prisma.size.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Size not found");
  }

  // If updating productId, verify product exists
  if (payload.productId) {
    const productExists = await prisma.product.findUnique({
      where: { id: payload.productId },
    });

    if (!productExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
    }
  }

  // If updating name or productId, check for duplicates
  if (payload.name || payload.productId) {
    const checkName = payload.name || result.name;
    const checkProductId = payload.productId || result.productId;

    const existingSize = await prisma.size.findFirst({
      where: {
        name: checkName,
        productId: checkProductId,
        id: {
          not: id,
        },
      },
    });

    if (existingSize) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Size with this name already exists for this product.",
      );
    }
  }

  const updatedSize = await prisma.size.update({
    where: {
      id,
    },
    data: payload,
    include: {
      product: true,
    },
  });

  return updatedSize;
};

const deleteSize = async (id: string): Promise<Size> => {
  const result = await prisma.size.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Size not found");
  }

  const deletedSize = await prisma.size.delete({
    where: {
      id,
    },
    include: {
      product: true,
    },
  });

  return deletedSize;
};

export const SizeService = {
  addSize,
  getAllSizes,
  getSingleSize,
  updateSize,
  deleteSize,
};
