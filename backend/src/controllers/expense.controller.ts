import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import * as expenseService from "../services/expense.service";
import { ApiError } from "../utils/apiError";

const getUserId = (req: Request): string => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }
  return req.user.id;
};

const getParamId = (req: Request): string => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Invalid expense id");
  }
  return id;
};

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await expenseService.createExpense(getUserId(req), req.body);
  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense
  });
});

export const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const result = await expenseService.getExpenses(getUserId(req), {
    category: req.query.category as never,
    search: req.query.search as string | undefined,
    startDate: req.query.startDate ? new Date(String(req.query.startDate)) : undefined,
    endDate: req.query.endDate ? new Date(String(req.query.endDate)) : undefined,
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 10)
  });

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    data: result.items,
    pagination: result.pagination
  });
});

export const getExpenseById = catchAsync(async (req: Request, res: Response) => {
  const expense = await expenseService.getExpenseById(getUserId(req), getParamId(req));
  res.status(200).json({
    success: true,
    message: "Expense fetched successfully",
    data: expense
  });
});

export const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await expenseService.updateExpense(
    getUserId(req),
    getParamId(req),
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: expense
  });
});

export const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  await expenseService.deleteExpense(getUserId(req), getParamId(req));
  res.status(200).json({
    success: true,
    message: "Expense deleted successfully"
  });
});

export const getExpenseSummary = catchAsync(async (req: Request, res: Response) => {
  const summary = await expenseService.getExpenseSummary(getUserId(req));
  res.status(200).json({
    success: true,
    message: "Expense summary fetched successfully",
    data: summary
  });
});

export const getMonthlySummary = catchAsync(async (req: Request, res: Response) => {
  const summary = await expenseService.getMonthlySummary(getUserId(req));
  res.status(200).json({
    success: true,
    message: "Monthly summary fetched successfully",
    data: summary
  });
});
