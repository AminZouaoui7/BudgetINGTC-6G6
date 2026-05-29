import type { Budget, BudgetPeriod, Transaction } from "../app/types";
import api from "./api";
import { mapBudget } from "./mappers";
import { getStoredUser } from "./storage";

type BudgetPayload = {
  name: string;
  amount: number;
  description?: string;
  periodType: BudgetPeriod;
  startDate: string;
  endDate: string;
  isShared: boolean;
  ownerId?: number;
};

function getOwnerId(ownerId?: number) {
  const storedUser = getStoredUser();
  const resolvedOwnerId = ownerId ?? storedUser?.id;

  if (!resolvedOwnerId) {
    throw new Error("Utilisateur introuvable pour creer ou modifier le budget.");
  }

  return resolvedOwnerId;
}

export const budgetService = {
  async getAll(transactions: Transaction[] = []) {
    const { data } = await api.get("/budget/getall");
    return (data.budgets ?? []).map((budget: any) => mapBudget(budget, transactions)) as Budget[];
  },

  async getById(id: number, transactions: Transaction[] = []) {
    const { data } = await api.get(`/budget/getallbyid/${id}`);
    return mapBudget(data.budget, transactions);
  },

  async create(payload: BudgetPayload) {
    const { data } = await api.post("/budget/create", {
      name: payload.name,
      amount: payload.amount,
      description: payload.description,
      periodType: payload.periodType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isshared: payload.isShared,
      ownerId: getOwnerId(payload.ownerId),
    });

    return mapBudget(data.budget);
  },

  async update(id: number, payload: BudgetPayload) {
    const { data } = await api.put(`/budget/update/${id}`, {
      name: payload.name,
      amount: payload.amount,
      description: payload.description,
      periodType: payload.periodType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isshared: payload.isShared,
      ownerId: getOwnerId(payload.ownerId),
    });

    return mapBudget(data.budget);
  },

  async remove(id: number) {
    await api.delete(`/budget/delete/${id}`);
  },

  async addMember(id: number, payload: { userId?: number; email?: string; role: string }) {
    const { data } = await api.post(`/budget/add-member/${id}`, payload);
    return data.member;
  },

  async removeMember(id: number, userId: number) {
    await api.delete(`/budget/remove-member/${id}/${userId}`);
  },

  async setCategoryLimit(id: number, categoryId: number, limit: number) {
    const { data } = await api.post(`/budget/category-limits/${id}`, { categoryId, limit });
    return data.categoryLimit;
  },
};
