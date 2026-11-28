import { type Request, type Response } from "express";

import prisma from "../../prisma/client.ts";

export const postAnnouncement = async (req: Request, res: Response) => {
  const announcement = await prisma.announcement.create({
    data: {
      ...req.body,
      userId: req.user!.id,
    },
    include: {
      user: {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    omit: {
      userId: true,
    },
  });

  res.status(201).json({ announcement });
};
