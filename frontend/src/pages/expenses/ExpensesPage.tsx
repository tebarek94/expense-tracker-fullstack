import { AxiosError } from "axios";
import { Download, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { ExpenseForm } from "../../components/shared/ExpenseForm";
import { ExpenseTable } from "../../components/shared/ExpenseTable";
import { Pagination } from "../../components/shared/Pagination";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { PaginatedResponse } from "../../types/api";
import { Expense, ExpenseInput } from "../../types/expense";
import { downloadExpensesCsv } from "../../utils/csv";

interface QueryState {
  page: number;
  limit: number;
  search: string;
  category: string;
  startDate: string;
  endDate: string;
}

const initialQuery: QueryState = {
  page: 1,
  limit: 10,
  search: "",
  category: "",
  startDate: "",
  endDate: ""
};

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<QueryState>(initialQuery);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const params = useMemo(() => {
    const finalQuery: Record<string, string | number> = {
      page: query.page,
      limit: query.limit
    };

    if (query.search) finalQuery.search = query.search;
    if (query.category) finalQuery.category = query.category;
    if (query.startDate) finalQuery.startDate = query.startDate;
    if (query.endDate) finalQuery.endDate = query.endDate;

    return finalQuery;
  }, [query]);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PaginatedResponse<Expense>>("/expenses", { params });
      setExpenses(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      const message =
        (error as AxiosError<{ message?: string }>).response?.data?.message ??
        "Failed to load expenses";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmitExpense = async (payload: ExpenseInput) => {
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, payload);
        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", payload);
        toast.success("Expense added successfully");
      }
      closeModal();
      await fetchExpenses();
    } catch (error) {
      const message =
        (error as AxiosError<{ message?: string }>).response?.data?.message ??
        "Failed to save expense";
      toast.error(message);
    }
  };

  const confirmDeleteExpense = async () => {
    if (!deletingExpense) {
      return;
    }
    try {
      setIsDeleteLoading(true);
      await api.delete(`/expenses/${deletingExpense.id}`);
      toast.success("Expense deleted successfully");
      setDeletingExpense(null);
      await fetchExpenses();
    } catch (error) {
      const message =
        (error as AxiosError<{ message?: string }>).response?.data?.message ??
        "Failed to delete expense";
      toast.error(message);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Expense Management
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => downloadExpensesCsv(expenses)}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => {
                setEditingExpense(null);
                setIsModalOpen(true);
              }}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <Input
            label="Search"
            placeholder="Search by title"
            value={query.search}
            onChange={(event) => setQuery((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
          />
          <Select
            label="Category"
            value={query.category}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, category: event.target.value, page: 1 }))
            }
            options={[
              { label: "All", value: "" },
              { label: "Food", value: "FOOD" },
              { label: "Transport", value: "TRANSPORT" },
              { label: "Entertainment", value: "ENTERTAINMENT" },
              { label: "Bills", value: "BILLS" },
              { label: "Other", value: "OTHER" }
            ]}
          />
          <Input
            label="Start Date"
            type="date"
            value={query.startDate}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, startDate: event.target.value, page: 1 }))
            }
          />
          <Input
            label="End Date"
            type="date"
            value={query.endDate}
            onChange={(event) => setQuery((prev) => ({ ...prev, endDate: event.target.value, page: 1 }))}
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setQuery(initialQuery);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <>
          <ExpenseTable
            expenses={expenses}
            onDelete={(expense) => setDeletingExpense(expense)}
            onEdit={(expense) => {
              setEditingExpense(expense);
              setIsModalOpen(true);
            }}
          />
          <Pagination
            page={query.page}
            totalPages={totalPages}
            onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        </>
      )}

      <Modal
        open={isModalOpen}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        onClose={closeModal}
      >
        <ExpenseForm initialExpense={editingExpense} onSubmit={handleSubmitExpense} onCancel={closeModal} />
      </Modal>
      <ConfirmDialog
        open={Boolean(deletingExpense)}
        title="Delete Expense"
        description={
          deletingExpense
            ? `Are you sure you want to delete "${deletingExpense.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Expense"
        isLoading={isDeleteLoading}
        onCancel={() => setDeletingExpense(null)}
        onConfirm={confirmDeleteExpense}
      />
    </div>
  );
};
