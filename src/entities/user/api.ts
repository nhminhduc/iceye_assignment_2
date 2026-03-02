import { apiClient } from "@/lib/api-client";

import type { User, UserListItem } from "./types";

export const userApi = {
  list: async (): Promise<UserListItem[]> => {
    const { data } = await apiClient.get<UserListItem[]>("/users");
    return data;
  },

  getById: async (userId: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${userId}`);
    return data;
  },

  update: async (
    userId: string,
    payload: { name?: string; password?: string },
  ): Promise<User> => {
    const { data } = await apiClient.post<User>(`/users/${userId}`, payload);
    return data;
  },
};
