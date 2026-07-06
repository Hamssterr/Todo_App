import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { RefreshResponse } from "@/types/auth.type";

const http = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Tránh việc retry cho request /auth/login hoặc /auth/refresh
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post<RefreshResponse>("/api/auth/refresh");

        if (data.success && data.data.accessToken) {
          const newAccessToken = data.data.accessToken;
          const user = useAuthStore.getState().user;

          if (user) {
            useAuthStore.getState().setAuth(user, newAccessToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default http;
