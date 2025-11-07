import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

interface CreateContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

const createContactMessage = async (payload: CreateContactMessagePayload) => {
  const contactMessage = await prisma.contactMessage.create({
    data: payload,
  });

  return contactMessage;
};

const getContactMessages = async () => {
  const contactMessages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return contactMessages;
};

const markAsRead = async (id: string) => {
  const existingMessage = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!existingMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact message not found");
  }

  const contactMessage = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  return contactMessage;
};

const deleteContactMessage = async (id: string) => {
  const existingMessage = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!existingMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact message not found");
  }

  await prisma.contactMessage.delete({
    where: { id },
  });
};

export const ContactMessageService = {
  createContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
};
