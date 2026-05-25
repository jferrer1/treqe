import { create } from "zustand";
import { api, User } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await api.login(email, password);
      api.saveToken(token);
      set({ user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await api.register(email, password, name);
      api.saveToken(token);
      set({ user, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  logout: () => {
    api.clearToken();
    set({ user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("treqe-token");
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const user = await api.me();
      set({ user, loading: false });
    } catch {
      api.clearToken();
      set({ user: null, loading: false });
    }
  },
}));
