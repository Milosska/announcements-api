import { Router } from "express";

import { authenticate, validateBody } from "../middlewares/index.ts";

import { createAnnouncementSchema } from "../validators/announcementsValidator.ts";

import { postAnnouncement } from "../controllers/announcementsControllers.ts";

const announcementsRouter = Router();

announcementsRouter.post(
  "/",
  authenticate,
  validateBody(createAnnouncementSchema),
  postAnnouncement,
);

export default announcementsRouter;
