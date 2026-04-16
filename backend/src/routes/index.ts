import { Router } from "express";
import authRouter from "./auth.routes";
import expenseRouter from "./expense.routes";
import profileRouter from "./profile.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/profile", profileRouter);

export default apiRouter;
