import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { HeroService } from "./hero.service";

const getHeroSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.getHeroSettings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero settings retrieved successfully",
    data: result,
  });
});

const updateHeroSettings = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Updating hero settings with ID:", id);
  console.log("Request body:", req.body);

  const result = await HeroService.updateHeroSettings(id, req.body);

  console.log("Update successful:", result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hero settings updated successfully",
    data: result,
  });
});

export const HeroController = {
  getHeroSettings,
  updateHeroSettings,
};
