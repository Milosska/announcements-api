import { Router } from "express";

import { authenticate, validateBody } from "../middlewares/index.ts";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../validators/authValidator.ts";

import {
  register,
  login,
  refresh,
  getMe,
  logout,
} from "../controllers/authController.ts";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.post("/refresh", validateBody(refreshSchema), refresh);

authRouter.get("/me", authenticate, getMe);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
