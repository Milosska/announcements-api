import { Router } from "express";

import {
  authenticate,
  validateBody,
  validateQuery,
} from "../middlewares/index.ts";

import {
  getAnnouncementsQuerySchema,
  createAnnouncementSchema,
} from "../validators/announcementsValidator.ts";

import {
  getAnnouncements,
  postAnnouncement,
} from "../controllers/announcementsControllers.ts";

const announcementsRouter = Router();

announcementsRouter.get(
  "/",
  validateQuery(getAnnouncementsQuerySchema),
  getAnnouncements,
);

announcementsRouter.post(
  "/",
  authenticate,
  validateBody(createAnnouncementSchema),
  postAnnouncement,
);

export default announcementsRouter;
