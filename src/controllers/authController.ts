import { type Request, type Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../prisma/client.ts";

import {
  createTokens,
  setRefreshTokenCookie,
} from "../services/authService.ts";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userWithUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (userWithUsername) {
    res.status(409).json({
      message: `User with username ${username} already exists.`,
    });
  }

  const userWithEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithEmail) {
    res.status(409).json({
      message: `User with email ${email} is already registered.`,
    });
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
