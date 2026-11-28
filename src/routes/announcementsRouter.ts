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
  updateAnnouncementSchema,
} from "../validators/announcementsValidator.ts";

import {
  getAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  updateAnnouncement,
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

announcementsRouter.patch(
  "/:id",
  authenticate,
  validateParams(getAnnouncementParamSchema),
  validateBody(updateAnnouncementSchema),
  updateAnnouncement,
);

export default announcementsRouter;
