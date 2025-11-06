import api from "@/api/axiosInstance";

/**
 * 조직 가입 요청 API (POST /orgs/{orgId}/join)
 * @param orgId 조직 ID
 * @param code 조직 코드 (영문+숫자 6자리)
 * @returns 성공 여부 (true / false)
 */
export const joinOrganization = async (orgId: number, code: string): Promise<boolean> => {
  try {
    const response = await api.post(`/orgs/${orgId}/join`, { code });
    const result = response.data?.result;

    return result?.is_success === true;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "조직 가입 요청 중 오류가 발생했습니다.";

    throw new Error(message);
  }
};