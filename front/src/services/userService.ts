import type { User } from "../app/types";
import api from "./api";
import { mapUser } from "./mappers";

type UserUpdatePayload = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  role: "admin" | "user";
  isActive: boolean;
};

type UserProfilePayload = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const userService = {
  async getMe() {
    const { data } = await api.get("/user/me");
    return mapUser(data.user);
  },

  async updateMe(payload: UserProfilePayload) {
    const { data } = await api.put("/user/me", payload);
    return mapUser(data.user);
  },

  async changePassword(payload: ChangePasswordPayload) {
    const { data } = await api.put("/user/change-password", payload);
    return {
      message: data.message as string,
    };
  },

  async getAll() {
    const { data } = await api.get("/user/getallusers");
    return (data.users ?? []).map((user: any) => mapUser(user)) as User[];
  },

  async update(id: number, payload: Partial<UserUpdatePayload>) {
    const { data } = await api.put(`/user/updateuser/${id}`, payload);
    return mapUser(data.user);
  },

  async activate(id: number) {
    const { data } = await api.put(`/user/activateuser/${id}`);
    return mapUser(data.user);
  },

  async remove(id: number) {
    await api.delete(`/user/deleteuser/${id}`);
  },
};
