import type { Category } from "../app/types";
import api from "./api";
import { mapCategory } from "./mappers";

type CategoryPayload = {
  name: string;
  note?: string;
  type: "income" | "expense";
  color: string;
  icon: string;
};

export const categoryService = {
  async getAll() {
    const { data } = await api.get("/category/getall");
    return (data.categories ?? []).map((category: any) => mapCategory(category)) as Category[];
  },

  async getById(id: number) {
    const { data } = await api.get(`/category/getbyid/${id}`);
    return mapCategory(data.category);
  },

  async create(payload: CategoryPayload) {
    const { data } = await api.post("/category/create", {
      name: payload.name,
      description: payload.note,
      type: payload.type,
      color: payload.color,
      icon: payload.icon,
    });

    return mapCategory(data.category);
  },

  async update(id: number, payload: CategoryPayload) {
    const { data } = await api.put(`/category/update/${id}`, {
      name: payload.name,
      description: payload.note,
      type: payload.type,
      color: payload.color,
      icon: payload.icon,
    });

    return mapCategory(data.category);
  },

  async remove(id: number) {
    await api.delete(`/category/delete/${id}`);
  },
};
