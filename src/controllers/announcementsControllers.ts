import { type Request, type Response } from "express";

import prisma from "../../prisma/client.ts";

export const getAnnouncements = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = "newest", search } = res.locals.query;
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: sort === "newest" ? "desc" : "asc",
      },
      omit: {
        userId: true,
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
    }),
    prisma.announcement.count({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    }),
  ]);

  res.json({
    data: announcements,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      perPage: limit,
    },
  });
};

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
