import type { RawAxiosRequestHeaders } from "axios";
import axios from "axios";

import { useAuthStore } from "@/features/auth/authStore";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token from Zustand store on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    (config.headers as RawAxiosRequestHeaders).Authorization =
      `Bearer ${token}`;
  }
  return config;
});

// On 401, clear auth state so the AuthGuard redirects to /login
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  },
);
