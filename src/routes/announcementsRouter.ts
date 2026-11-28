import { Router } from "express";

import {
  authenticate,
  validateBody,
  validateQuery,
  validateParams,
} from "../middlewares/index.ts";

import {
  getAnnouncementsQuerySchema,
  getAnnouncementParamSchema,
  createAnnouncementSchema,
} from "../validators/announcementsValidator.ts";

import {
  getAnnouncements,
  getAnnouncementById,
  postAnnouncement,
} from "../controllers/announcementsControllers.ts";

const announcementsRouter = Router();

announcementsRouter.get(
  "/",
  validateQuery(getAnnouncementsQuerySchema),
  getAnnouncements,
);

announcementsRouter.get(
  "/:id",
  validateParams(getAnnouncementParamSchema),
  getAnnouncementById,
);

announcementsRouter.post(
  "/",
  authenticate,
  validateBody(createAnnouncementSchema),
  postAnnouncement,
);

export default announcementsRouter;
