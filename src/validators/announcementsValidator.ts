import { z } from "./config.ts";
import { meSchema } from "./authValidator.ts";

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
