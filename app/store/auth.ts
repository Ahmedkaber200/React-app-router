import { setAuthToken } from "@/client/api-client";
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

// 1. Store type
type AuthState = {
  user: User | null;                
  setUser: (user: User | null) => void;
};

// 2. Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,                        
  setUser: (user) => set({ user }),
}));
