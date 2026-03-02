import { useMutation } from "@tanstack/react-query";

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
      const tokenData = await authApi.login(userId, password);
      return { token: tokenData.access, userId };
    },
    onSuccess: ({ token, userId }) => {
      login(token, userId);
    },
  });
}
