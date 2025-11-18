import api from "@/api/axiosInstance";
import type { SignupRequest, SignupResponse } from "@/types/auth";

/**
 * 회원가입 API
 * @param data SignupRequest (회원가입 요청 데이터)
 * @returns SignupResponse (회원가입 결과)
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>("/user/signup", data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 회원가입 API 오류:", error.response?.data || error.message);

    // 백엔드에서 내려주는 메시지가 있다면 그대로 사용
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // 기본 에러 메시지
    throw new Error("회원가입 요청 중 오류가 발생했습니다.");
  }
};

export default signup;