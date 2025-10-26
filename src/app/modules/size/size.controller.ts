import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import sendResponse from "../../../utils/sendResponse";
import { SizeService } from "./size.service";

// add new size
const addSize = catchAsync(async (req: Request, res: Response) => {
  const result = await SizeService.addSize(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Size added successfully",
    data: result,
  });
});

// get all sizes with filtering
const getAllSizes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "productId"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await SizeService.getAllSizes(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sizes retrieved successfully",
    data: result.data,
  });
});

// get single size
const getSingleSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SizeService.getSingleSize(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Size retrieved successfully",
    data: result,
  });
});

// update size
const updateSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SizeService.updateSize(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Size updated successfully",
    data: result,
  });
});

// delete size
const deleteSize = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SizeService.deleteSize(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Size deleted successfully",
    data: result,
  });
});

export const sizeController = {
  addSize,
  getAllSizes,
  getSingleSize,
  updateSize,
  deleteSize,
};
