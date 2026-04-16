import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/apiError";
import * as profileService from "../services/profile.service";

const getUserId = (req: Request): string => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }
  return req.user.id;
};

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(getUserId(req));
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: profile
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await profileService.updateProfile(getUserId(req), req.body);
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile
  });
});

export const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  await profileService.deleteProfile(getUserId(req));
  res.status(200).json({
    success: true,
    message: "Profile deleted successfully"
  });
});
