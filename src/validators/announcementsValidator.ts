import { z } from "./config.ts";
import { meSchema } from "./authValidator.ts";

export const getAnnouncementsQuerySchema = z.object({
  search: z.string().trim().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export const getAnnouncementParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(100).openapi({
    example: "Vintage wooden desk",
  }),
  description: z.string().min(3).max(500).openapi({
    example:
      "A well-maintained wooden desk with two drawers, ideal for a home office.",
  }),
  price: z.number().positive().openapi({
    example: 4500,
  }),
  category: z.string().min(3).max(20).openapi({
    example: "Furniture",
  }),
});

export const announcementSchema = z.object({
  id: z.number().positive(),
  ...createAnnouncementSchema.shape,
  createdAt: z.date(),
  updatedAt: z.date(),
  user: meSchema.omit({ createdAt: true, updatedAt: true }),
});

export const paginatedAnnouncementsSchema = z.object({
  data: z.array(announcementSchema),
  pagination: z.object({
    total: z.number().int().openapi({
      example: 30,
    }),
    totalPages: z.number().int().openapi({
      example: 3,
    }),
    page: getAnnouncementsQuerySchema.shape.page,
    perPage: getAnnouncementsQuerySchema.shape.limit,
  }),
});
