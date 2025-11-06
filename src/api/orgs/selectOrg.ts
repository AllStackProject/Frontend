import api from "@/api/axiosInstance";

/**
 * 조직 선택 (org_token 발급)
 * @param orgId 조직 ID
 */
export async function selectOrganization(orgId: number): Promise<boolean> {
  try {
    const response = await api.patch(`/orgs/${orgId}`);

    // 토큰은 헤더 또는 바디 중 하나로 받을 수 있음
    const orgToken =
      response.headers["authorization"]?.replace("Bearer ", "") ||
      response.data?.result?.org_token;

    if (!orgToken) {
      return false;
    }

    // 토큰 및 ID 저장
    localStorage.setItem("org_token", orgToken);
    localStorage.setItem("selectedOrgId", String(orgId))

    return response.data?.result?.is_success === true;
  } catch (err: any) {

    throw new Error(err.response?.data?.message || "조직 선택 중 오류가 발생했습니다.");
  }
}