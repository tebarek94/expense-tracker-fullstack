import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { ApiError } from "../utils/apiError";
import {
  JwtPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";
import { ROLES } from "../utils/rbac";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const buildTokenPayload = (user: { id: string; email: string }): JwtPayload => ({
  sub: user.id,
  email: user.email,
  role: ROLES.USER
});

const issueTokens = (payload: JwtPayload): AuthTokens => ({
  accessToken: signAccessToken(payload),
  refreshToken: signRefreshToken(payload)
});

export const register = async (payload: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existing) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  const tokens = issueTokens(buildTokenPayload(user));

  return { user, tokens };
};

export const login = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = issueTokens(buildTokenPayload(user));

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    tokens
  };
};

export const refreshAuthToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokens = issueTokens(buildTokenPayload(user));
  return { user, tokens };
};

export const logout = async () => {
  return { message: "Logged out successfully" };
};
