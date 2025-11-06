import api from "@/api/axiosInstance";
import type { UpdateUserInfoRequest } from "@/types/user";

export const updateUserInfo = async (data: UpdateUserInfoRequest): Promise<boolean> => {
  try {
    const response = await api.patch("/mypage/info", data);
    return response.data?.result?.is_success === true;
  } catch (err: any) {
    console.error("❌ [updateUserInfo] 오류:", err);
    throw new Error(err.response?.data?.message || "사용자 정보 수정 중 오류가 발생했습니다.");
  }
};