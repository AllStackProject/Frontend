import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { OrgMyActivityResponse } from "@/types/member";

/**
 * 조직 단건 정보 조회 (내 조직 활동 정보)
 */
export const fetchOrgMyActivityInfo = async (
  orgId: number
): Promise<OrgMyActivityResponse> => {
  try {
    const res = await api.get(`/${orgId}/myactivity/info`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return res.data.result;
  } catch (err: any) {
    console.error("❌ fetchOrgMyActivityInfo 실패:", err);
    throw new Error(
      err.response?.data?.message ||
        "조직 정보를 불러오지 못했습니다."
    );
  }
};