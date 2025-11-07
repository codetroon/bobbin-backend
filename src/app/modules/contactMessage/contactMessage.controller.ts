import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ContactMessageService } from "./contactMessage.service";

const createContactMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactMessageService.createContactMessage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact message sent successfully",
    data: result,
  });
});

const getContactMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactMessageService.getContactMessages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact messages retrieved successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactMessageService.markAsRead(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact message marked as read",
    data: result,
  });
});

const deleteContactMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ContactMessageService.deleteContactMessage(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact message deleted successfully",
    data: null,
  });
});

export const ContactMessageController = {
  createContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
};
