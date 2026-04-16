import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema
} from "../validations/auth.validation";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/refresh", validate(refreshTokenSchema), authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
