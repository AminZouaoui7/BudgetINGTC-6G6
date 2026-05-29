import type { Transaction } from "../app/types";
import api from "./api";
import { mapTransaction } from "./mappers";

type TransactionPayload = {
  amount: number;
  type: "income" | "expense";
  date: string;
  description?: string;
  categoryId?: number | null;
  budgetId?: number | null;
};

export const transactionService = {
  async getAll() {
    const { data } = await api.get("/transaction/getall");
    return (data.transactions ?? []).map((transaction: any) => mapTransaction(transaction)) as Transaction[];
  },

  async getById(id: number) {
    const { data } = await api.get(`/transaction/getbyid/${id}`);
    return mapTransaction(data.transaction);
  },

  async getByBudget(budgetId: number) {
    const { data } = await api.get(`/transaction/budget/${budgetId}`);
    return (data.transactions ?? []).map((transaction: any) => mapTransaction(transaction)) as Transaction[];
  },

  async getByUser() {
    const { data } = await api.get("/transaction/user");
    return (data.transactions ?? []).map((transaction: any) => mapTransaction(transaction)) as Transaction[];
  },

  async create(payload: TransactionPayload) {
    const { data } = await api.post("/transaction/create", {
      ...payload,
      amount: Math.abs(payload.amount),
    });
    return mapTransaction(data.transaction);
  },

  async update(id: number, payload: TransactionPayload) {
    const { data } = await api.put(`/transaction/update/${id}`, {
      ...payload,
      amount: Math.abs(payload.amount),
    });
    return mapTransaction(data.transaction);
  },

  async remove(id: number) {
    await api.delete(`/transaction/delete/${id}`);
  },
};
