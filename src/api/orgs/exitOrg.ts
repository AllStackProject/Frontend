import api from "@/api/axiosInstance";

/**
 * 조직 나가기 API (PUT /orgs/{orgId})
 * @param orgId 조직 ID
 * @returns 성공 여부 (true / false)
 */
export const exitOrganization = async (orgId: number): Promise<boolean> => {
  try {
    const response = await api.put(`/orgs/${orgId}`);
    const result = response.data?.result;

    return result?.is_success === true;
  } catch (error: any) {

    throw new Error(
      error.response?.data?.message || "조직 나가기 중 오류가 발생했습니다."
    );
  }
};