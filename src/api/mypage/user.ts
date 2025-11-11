import api from "@/api/axiosInstance";
import type { UserInfoResponse } from "@/types/user";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/**
 * 사용자 정보 조회 API (GET /user/info)
 */
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    const response = await api.get("/user/info");
    
    return response.data.result;
  } catch (error: any) {
    console.error("❌ [getUserInfo] 오류:", error);
    throw new Error(
      error.response?.data?.message || "사용자 정보를 불러오지 못했습니다."
    );
  }
};

/**
 * 사용자 탈퇴 API (DELETE /user)
 */
export const deleteUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

    const response = await api.delete(`/user`, {
      tokenType: "user", 
    } as CustomAxiosRequestConfig);

    if (response.data?.result?.is_success) {
      return { success: true, message: "회원 탈퇴가 완료되었습니다." };
    } else {
      throw new Error(response.data?.message || "회원 탈퇴에 실패했습니다.");
    }
  } catch (err: any) {
    console.error("🚨 [deleteUser] 탈퇴 실패:", err);
    throw new Error(err.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.");
  }
};