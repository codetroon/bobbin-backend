import { Order, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces";
import prisma from "../../../shared/prisma";

type IOrderFilterRequest = {
  searchTerm?: string;
  status?: string;
  productId?: string;
};

type ICreateOrderData = Omit<Order, "id" | "createdAt" | "updatedAt">;
type IUpdateOrderData = Partial<ICreateOrderData>;

const addOrder = async (orderData: ICreateOrderData): Promise<Order> => {
  // Verify product exists
  const productExists = await prisma.product.findUnique({
    where: { id: orderData.productId },
  });

  if (!productExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  const newOrder = await prisma.order.create({
    data: orderData,
    include: {
      products: {
        include: {
          category: true,
          Size: true,
        },
      },
    },
  });
  return newOrder;
};

const getAllOrders = async (
  filters: IOrderFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, status, productId } = filters;

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          customerName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          contactNumber: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  if (productId) {
    andConditions.push({
      productId,
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    include: {
      products: {
        include: {
          category: true,
          Size: true,
        },
      },
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

  const total = await prisma.order.count({
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

const getSingleOrder = async (id: string): Promise<Order> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          category: true,
          Size: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return result;
};

const updateOrder = async (
  id: string,
  payload: IUpdateOrderData,
): Promise<Order> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
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

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
    include: {
      products: {
        include: {
          category: true,
          Size: true,
        },
      },
    },
  });

  return updatedOrder;
};

const deleteOrder = async (id: string): Promise<Order> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const deletedOrder = await prisma.order.delete({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          category: true,
          Size: true,
        },
      },
    },
  });

  return deletedOrder;
};

export const OrderService = {
  addOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
