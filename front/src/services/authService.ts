import type { User } from "../app/types";
import api from "./api";
import { mapUser } from "./mappers";
import { clearStoredAuth, getStoredToken, getStoredUser, setStoredAuth } from "./storage";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
};

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post("/user/login", payload);
    const user = mapUser(data.user);
    const token = data.token as string;

    setStoredAuth(token, user);

    return {
      message: data.message as string,
      token,
      user,
    };
  },

  async register(payload: RegisterPayload) {
    const { data } = await api.post("/user/register", payload);

    return {
      message: data.message as string,
      user: mapUser(data.user),
    };
  },

  logout() {
    clearStoredAuth();
  },

  getToken() {
    return getStoredToken();
  },

  getUser(): User | null {
    return getStoredUser();
  },
};
