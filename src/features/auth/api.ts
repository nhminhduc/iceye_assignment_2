import { apiClient } from "@/lib/api-client";

type TokenResponse = {
  access: string;
};

export const authApi = {
  login: async (userId: string, password: string): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>("/token", {
      user_id: userId,
      password,
    });
    return data;
  },
};
