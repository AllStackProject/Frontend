import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";


/** 조직 가입 요청 */
export const joinOrganization = async (code: string, nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    // accesstoken 누락 시 오류 처리
    if (!accessToken) {
      throw new Error("사용자 정보가 유효하지 않습니다. 다시 로그인해주세요.");
    }

    // API 호출 (accessToken 인증)
    const response = await api.post(`/orgs/join`,
      { code, nickname },
      {
        tokenType: "user",
      } as CustomAxiosRequestConfig);

    // 응답 처리
    if (response.data?.result?.is_success) {
      return { success: true, message: "조직 가입 요청이 완료되었습니다." };
    } else {
      throw new Error(response.data?.message || "조직 가입에 실패했습니다.");
    }
  } catch (err: any) {
    console.error("🚨 조직 가입 실패:", err);
    throw new Error(
      err.response?.data?.message || "조직 가입 요청 중 오류가 발생했습니다."
    );
  }
};

/* 조직 닉네임 중복 조회 */
export const checkNicknameAvailability = async (code: string, nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }

    // API 호출
    const response = await api.get(
      `/orgs/availability/nickname`,
      {
        params: { code: code, nickname: nickname },
        tokenType: "user", 
      } as CustomAxiosRequestConfig
    );

    return response.data?.result?.is_success === true;
  } catch (err: any) {
    console.error("🚨 닉네임 중복 확인 실패:", err);
    throw new Error(err.response?.data?.message || "닉네임 중복 확인 중 오류가 발생했습니다.");
  }
};