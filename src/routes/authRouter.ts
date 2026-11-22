import { Router } from "express";

import validateBody from "../middlewares/validateBody.ts";

import { registerSchema } from "../validators/authValidator.ts";

import { register } from "../controllers/authController.ts";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);

export default authRouter;
