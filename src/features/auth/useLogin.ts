import { useMutation } from "@tanstack/react-query";

import { authApi } from "./api";
import { useAuthStore } from "./authStore";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) =>
      authApi.login(userId, password),
    onSuccess: (data, variables) => {
      login(data.access, variables.userId);
    },
  });
}
