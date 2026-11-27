import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Response } from "express";

import prisma from "../../prisma/client.ts";

import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from "../constants/constants.ts";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const createTokens = async (userId: number) => {
  const accessToken = jwt.sign({}, JWT_SECRET, {
    subject: String(userId),
    expiresIn: ACCESS_TOKEN_LIFETIME / 1000,
  });

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  await prisma.refreshToken.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      token: refreshToken,
      expiresAt,
    },
    update: {
      token: refreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string" || !payload.sub) {
      throw new Error("Token payload must contain sub");
    }
    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Invalid token"),
      data: null,
    };
  }
};
