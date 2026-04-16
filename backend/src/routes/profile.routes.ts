import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema } from "../validations/profile.validation";

const profileRouter = Router();

profileRouter.use(authenticateUser);

profileRouter.get("/", profileController.getProfile);
profileRouter.put("/", validate(updateProfileSchema), profileController.updateProfile);
profileRouter.delete("/", profileController.deleteProfile);

export default profileRouter;
