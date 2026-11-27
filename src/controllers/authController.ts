import { type Request, type Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import prisma from "../../prisma/client.ts";

import {
  createTokens,
  setRefreshTokenCookie,
} from "../services/authService.ts";

import type { userResponse } from "../validators/authValidator.ts";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userWithUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (userWithUsername) {
    throw createHttpError(
      409,
      `User with username ${username} already exists.`,
    );
  }

  const userWithEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithEmail) {
    throw createHttpError(
      409,
      `User with email ${email} is already registered.`,
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      ...req.body,
      password: hashPassword,
    },
    omit: {
      password: true,
    },
  });

  const { accessToken, refreshToken } = await createTokens(newUser.id);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    user: newUser,
    accessToken,
    refreshToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw createHttpError(401, `Incorrect username or password.`);
  }

  const { password: dbUserPassword, ...userData } = user;
  const isPasswordValid = await bcrypt.compare(password, dbUserPassword);
  if (!isPasswordValid) {
    throw createHttpError(401, `Incorrect username or password.`);
  }

  const { accessToken, refreshToken } = await createTokens(user.id);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    user: userData,
    accessToken,
    refreshToken,
  });
};
