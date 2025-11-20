import api from "@/api/axiosInstance";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/user/login", data);
    const token = response.headers["authorization"] || response.headers["Authorization"];

    if (token) {
      localStorage.setItem("access_token", token.replace("Bearer ", ""));
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error("❌ 로그인 API 오류:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
  }
};