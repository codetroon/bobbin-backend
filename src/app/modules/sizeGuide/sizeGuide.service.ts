import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

interface CreateSizeGuidePayload {
  name: string;
  imageUrl: string;
  categoryId: string;
  isActive?: boolean;
}

interface UpdateSizeGuidePayload {
  name?: string;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
}

const getSizeGuides = async () => {
  const sizeGuides = await prisma.sizeGuide.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sizeGuides;
};

const getSizeGuideByCategory = async (categoryId: string) => {
  const sizeGuide = await prisma.sizeGuide.findUnique({
    where: {
      categoryId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return sizeGuide;
};

const createSizeGuide = async (payload: CreateSizeGuidePayload) => {
  // Check if category exists
  const categoryExists = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!categoryExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Check if size guide already exists for this category
  const existingSizeGuide = await prisma.sizeGuide.findUnique({
    where: { categoryId: payload.categoryId },
  });

  if (existingSizeGuide) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Size guide already exists for this category",
    );
  }

  const sizeGuide = await prisma.sizeGuide.create({
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return sizeGuide;
};

const updateSizeGuide = async (id: string, payload: UpdateSizeGuidePayload) => {
  // Check if size guide exists
  const existingSizeGuide = await prisma.sizeGuide.findUnique({
    where: { id },
  });

  if (!existingSizeGuide) {
    throw new ApiError(httpStatus.NOT_FOUND, "Size guide not found");
  }

  // If categoryId is being updated, check if it exists
  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!categoryExists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }

    // Check if another size guide already exists for the new category
    if (payload.categoryId !== existingSizeGuide.categoryId) {
      const existingForCategory = await prisma.sizeGuide.findUnique({
        where: { categoryId: payload.categoryId },
      });

      if (existingForCategory) {
        throw new ApiError(
          httpStatus.CONFLICT,
          "Size guide already exists for this category",
        );
      }
    }
  }

  const sizeGuide = await prisma.sizeGuide.update({
    where: { id },
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return sizeGuide;
};

const deleteSizeGuide = async (id: string) => {
  // Check if size guide exists
  const existingSizeGuide = await prisma.sizeGuide.findUnique({
    where: { id },
  });

  if (!existingSizeGuide) {
    throw new ApiError(httpStatus.NOT_FOUND, "Size guide not found");
  }

  await prisma.sizeGuide.delete({
    where: { id },
  });
};

export const SizeGuideService = {
  getSizeGuides,
  getSizeGuideByCategory,
  createSizeGuide,
  updateSizeGuide,
  deleteSizeGuide,
};
