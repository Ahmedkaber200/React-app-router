import { setAuthToken } from "@/client/api-client";
import { create } from "zustand";

// 1. User type (adjust according to your API response)
export type User = {
  id: number;
  name: string;
  email: string;
  // add other fields like role, token, etc.
};

// 2. Store type
type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

// 3. Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => {
    setAuthToken('');
    set({ user: null });
    window.location.href = "/auth/login";
  },
}));