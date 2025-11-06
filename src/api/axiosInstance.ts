import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("access_token");
    const orgToken = localStorage.getItem("org_token");

    if (userToken) {
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }

    if (orgToken) {
      config.headers["X-Organization-Authorization"] = `Bearer ${orgToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
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