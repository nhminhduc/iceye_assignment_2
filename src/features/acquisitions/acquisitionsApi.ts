import type { Acquisition } from "@/entities/acquisition";
import { apiClient } from "@/lib/api-client";

export const acquisitionsApi = {
  getAll: async (): Promise<Acquisition[]> => {
    const { data } = await apiClient.get<Acquisition[]>("/acquisitions");
    return data;
  },
};
