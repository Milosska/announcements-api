import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

import { verifyToken } from "../services/authService.ts";

import prisma from "../../prisma/client.ts";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw createHttpError(401, "Missing authorization header");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw createHttpError(401, "Expected authorization header: Bearer <token>");
  }

  const { data, error } = verifyToken(token);
  if (error || !data) {
    throw createHttpError(401, error.message);
  }

  const userId = Number(data.sub);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw createHttpError(401, "User not found");
  }

  req.user = user;
  next();
};

export default authenticate;
