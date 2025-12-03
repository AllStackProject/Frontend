import axios, { AxiosHeaders } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { openModalGlobally } from "@/utils/modalDispatcher";

// 커스텀 설정 타입
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  tokenType?: "user" | "org" | "none";
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = localStorage.getItem("access_token");
    const orgToken = localStorage.getItem("org_token");
    const tokenType = config.tokenType || "user";

    // headers 인스턴스 타입 안전하게 접근
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

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // === 새로운 조직 Token 체크 ===
    const rawAuthHeader = response.headers["authorization"];

    if (rawAuthHeader) {
      console.log("🔄 새로운 Org Token 감지 → 업데이트");

      // "Bearer ..." 형태인지 체크
      const newToken = rawAuthHeader.startsWith("Bearer ")
        ? rawAuthHeader
        : `Bearer ${rawAuthHeader}`;

      // 기존 토큰 제거
      localStorage.removeItem("org_token");

      // 새 토큰 저장
      localStorage.setItem("org_token", newToken);
    }

    return response;
  },
  (error) => {
    const code = error?.response?.data?.code;

    // 인증 만료
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("org_token");
      window.location.href = "/login";
    }

    // 탈퇴 멤버 처리
    if (code === 5017) {
      openModalGlobally({
        type: "error",
        title: "접근 권한 없음",
        message: "해당 조직에서 탈퇴된 멤버입니다.\n다시 로그인해주세요.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;