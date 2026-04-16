import { Router } from "express";
import * as expenseController from "../controllers/expense.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createExpenseSchema,
  expenseQuerySchema,
  updateExpenseSchema
} from "../validations/expense.validation";

const expenseRouter = Router();

expenseRouter.use(authenticateUser);

expenseRouter.post("/", validate(createExpenseSchema), expenseController.createExpense);
expenseRouter.get("/", validate(expenseQuerySchema), expenseController.getExpenses);
expenseRouter.get("/summary", expenseController.getExpenseSummary);
expenseRouter.get("/monthly", expenseController.getMonthlySummary);
expenseRouter.get("/:id", expenseController.getExpenseById);
expenseRouter.put("/:id", validate(updateExpenseSchema), expenseController.updateExpense);
expenseRouter.delete("/:id", expenseController.deleteExpense);

export default expenseRouter;
