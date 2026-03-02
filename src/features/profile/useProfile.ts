import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userApi } from "@/entities/user";
import { useAuthStore } from "@/features/auth/authStore";

export function useProfile() {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => userApi.getById(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (payload: { name?: string; password?: string }) =>
      userApi.update(userId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
