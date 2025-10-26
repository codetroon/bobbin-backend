import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AuthService.loginUser(email, password);

  const { password: userPassword, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.createToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      user: userWithoutPassword,
      accessToken,
    },
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const user = await AuthService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

export const AuthController = {
  loginUser,
  getProfile,
};
