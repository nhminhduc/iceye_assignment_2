import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/entities/user";

import { useAuthStore } from "./authStore";

export function useCurrentUser() {
  const userId = useAuthStore((s) => s.userId);

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getById(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    userId,
    userName: user?.name ?? null,
    displayName: user?.name || userId || "User",
  };
}
