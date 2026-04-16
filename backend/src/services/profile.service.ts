import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { ApiError } from "../utils/apiError";

interface UpdateProfileInput {
  name?: string;
  email?: string;
  password?: string;
}

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  return user;
};

export const updateProfile = async (userId: string, payload: UpdateProfileInput) => {
  const current = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!current) {
    throw new ApiError(404, "User profile not found");
  }

  if (payload.email && payload.email !== current.email) {
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true }
    });
    if (existing) {
      throw new ApiError(409, "Email is already in use");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.password ? { password: await bcrypt.hash(payload.password, 12) } : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  return user;
};

export const deleteProfile = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId }
  });
};
