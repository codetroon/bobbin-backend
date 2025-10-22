import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Access token is required");
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      let verifiedUser: JwtPayload;
      try {
        verifiedUser = jwt.verify(
          token,
          config.jwt.secret as string,
        ) as JwtPayload;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.userId },
        select: {
          id: true,
          role: true,
          lastPasswordChange: true,
        },
      });

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists");
      }

      // Check if user changed password after token was issued
      if (
        user.lastPasswordChange &&
        verifiedUser.iat < user.lastPasswordChange.getTime() / 1000
      ) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "User recently changed password. Please login again",
        );
      }

      // Check if user has required role
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Insufficient permissions");
      }

      // Add user to request object
      req.user = {
        userId: user.id,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
