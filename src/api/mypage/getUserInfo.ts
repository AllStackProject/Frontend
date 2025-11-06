import api from "@/api/axiosInstance";
import type { UserInfoResponse } from "@/types/user";

/**
 * 사용자 정보 조회 API (GET /mypage/info)
 */
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response = await api.get("/mypage/info");
    
    return response.data.result;
  } catch (error: any) {
    console.error("❌ [getUserInfo] 오류:", error);
    throw new Error(
      error.response?.data?.message || "사용자 정보를 불러오지 못했습니다."
    );
  }
};