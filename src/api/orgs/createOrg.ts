import api from "@/api/axiosInstance";
import type { ApiResponse, CreateOrgRequest, CreateOrgResponse } from "@/types/org";

/**
 * 조직 생성 API
 * @param data CreateOrgRequest
 * @returns CreateOrgResponse
 */
export const createOrganization = async (
  data: CreateOrgRequest
): Promise<CreateOrgResponse> => {
  try {
    //console.log("🚀 [createOrganization] 요청:", data);
    const response = await api.post<ApiResponse<CreateOrgResponse>>("/orgs", data);

    //console.log("✅ [createOrganization] 응답:", response.data);

    // 백엔드 응답 구조가 { code, status, message, result: { id, code } }
    return response.data.result;
  } catch (error: any) {
    //console.error("❌ [createOrganization] 에러:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "조직 생성 중 오류가 발생했습니다."
    );
  }
};