import axios, { AxiosHeaders } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ✅ 커스텀 설정 타입
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  tokenType?: "user" | "org" | "none";
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ 요청 인터셉터
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem("access_token");
    const orgToken = localStorage.getItem("org_token");
    const tokenType = config.tokenType || "user";

    // ✅ headers 인스턴스 타입 안전하게 접근
    if (config.headers && config.headers instanceof AxiosHeaders) {
      if (tokenType === "user" && accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else if (tokenType === "org" && orgToken) {
        config.headers.set("Authorization", `Bearer ${orgToken}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🚨 토큰이 만료되었거나 유효하지 않습니다. 로그아웃 처리합니다.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("org_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;