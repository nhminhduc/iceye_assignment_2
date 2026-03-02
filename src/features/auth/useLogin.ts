import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { authApi } from "./api";
import { useAuthStore } from "./authStore";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({
      userId,
      password,
    }: {
      userId: string;
      password: string;
    }) => {
      try {
        const tokenData = await authApi.login(userId, password);
        return { token: tokenData.access, userId };
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          throw new Error("Invalid user ID or password.");
        }
        throw new Error("Something went wrong. Please try again.");
      }
    },
    onSuccess: ({ token, userId }) => {
      login(token, userId);
    },
  });
}
