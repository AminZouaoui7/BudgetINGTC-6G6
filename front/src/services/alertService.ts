import type { Alert } from "../app/types";
import api from "./api";
import { mapAlert } from "./mappers";

export const alertService = {
  async getAll() {
    const { data } = await api.get("/alert");
    return (data.alerts ?? []).map((alert: any) => mapAlert(alert)) as Alert[];
  },

  async markAllAsRead() {
    await api.put("/alert/read-all");
  },

  async markAsRead(id: number) {
    const { data } = await api.put(`/alert/${id}/read`);
    return data.alert ? mapAlert(data.alert) : null;
  },

  async remove(id: number) {
    await api.delete(`/alert/${id}`);
  },
};
