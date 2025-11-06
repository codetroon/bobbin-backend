import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { SizeGuideService } from "./sizeGuide.service";

const getSizeGuides = catchAsync(async (req: Request, res: Response) => {
  const result = await SizeGuideService.getSizeGuides();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Size guides retrieved successfully",
    data: result,
  });
});

const getSizeGuideByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await SizeGuideService.getSizeGuideByCategory(categoryId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Size guide retrieved successfully",
      data: result,
    });
  },
);

const createSizeGuide = catchAsync(async (req: Request, res: Response) => {
  const result = await SizeGuideService.createSizeGuide(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Size guide created successfully",
    data: result,
  });
});

const updateSizeGuide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SizeGuideService.updateSizeGuide(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Size guide updated successfully",
    data: result,
  });
});

const deleteSizeGuide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SizeGuideService.deleteSizeGuide(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Size guide deleted successfully",
    data: null,
  });
});

export const SizeGuideController = {
  getSizeGuides,
  getSizeGuideByCategory,
  createSizeGuide,
  updateSizeGuide,
  deleteSizeGuide,
};
