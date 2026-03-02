import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        userId: null,
        login: (token, userId) => set({ token, userId }),
        logout: () => set({ token: null, userId: null }),
      }),
      {
        name: "larvis-auth",
        partialize: (state) => ({
          token: state.token,
          userId: state.userId,
        }),
      },
    ),
  ),
);
