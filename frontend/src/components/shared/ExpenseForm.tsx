import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ExpenseInput, Expense } from "../../types/expense";
import { expenseSchema, ExpenseSchema } from "../../validations/expense.schema";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface ExpenseFormProps {
  initialExpense?: Expense | null;
  onSubmit: (payload: ExpenseInput) => Promise<void>;
  onCancel: () => void;
}

const categoryOptions = [
  { label: "Food", value: "FOOD" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Entertainment", value: "ENTERTAINMENT" },
  { label: "Bills", value: "BILLS" },
  { label: "Other", value: "OTHER" }
];

export const ExpenseForm = ({ initialExpense, onSubmit, onCancel }: ExpenseFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "FOOD",
      date: new Date().toISOString().split("T")[0]
    }
  });

  useEffect(() => {
    if (initialExpense) {
      reset({
        title: initialExpense.title,
        amount: Number(initialExpense.amount),
        category: initialExpense.category,
        date: initialExpense.date.slice(0, 10)
      });
      return;
    }
    reset({
      title: "",
      amount: 0,
      category: "FOOD",
      date: new Date().toISOString().split("T")[0]
    });
  }, [initialExpense, reset]);

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          title: values.title,
          amount: Number(values.amount),
          category: values.category,
          date: values.date
        });
      })}
    >
      <Input label="Title" placeholder="Expense title" error={errors.title?.message} {...register("title")} />
      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register("amount", { valueAsNumber: true })}
      />
      <Select label="Category" error={errors.category?.message} options={categoryOptions} {...register("category")} />
      <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialExpense ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};
