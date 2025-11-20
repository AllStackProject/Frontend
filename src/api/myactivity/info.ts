import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { OrgMyActivityResponse, OrgMyActivityGroupResponse } from "@/types/member";

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

/**
 * 조직 단건 정보 조회 (내 조직 활동 정보)
 */
export const fetchOrgMyActivityGroup = async (
  orgId: number
): Promise<OrgMyActivityGroupResponse> => {
  try {
    const res = await api.get(`/${orgId}/myactivity/group`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return res.data.result;
  } catch (err: any) {
    console.error("❌ fetchOrgMyActivityGroup 실패:", err);
    throw new Error(
      err.response?.data?.message ||
        "그룹 정보를 불러오지 못했습니다."
    );
  }
};

/* 닉네임 변경 */
export const updateMyOrgNickname = async (
  orgId: number,
  nickname: string
): Promise<boolean> => {
  try {
    const res = await api.put(
      `/${orgId}/myactivity/nickname`,
      { nickname },
      {
        tokenType: "org",
      } as CustomAxiosRequestConfig
    );

    return res.data?.result?.is_success === true;
  } catch (err: any) {
    console.error("❌ updateMyOrgNickname 실패:", err);
    throw new Error(
      err.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다."
    );
  }
};