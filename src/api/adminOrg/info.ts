import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/* 조직 정보 조회(그룹 조회 포함) */
export async function fetchOrgInfo(orgId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/orgs/info`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    
    const result = response.data.result;
    if (result?.img_url) {
      result.img_url = result.img_url.startsWith("http")
        ? result.img_url
        : `https://${result.img_url}`;
    }

    return result;
  } catch (error: any) {
    console.error("❌ 조직 정보 조회 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "조직 정보 조회 중 오류가 발생했습니다."
    );
  }
}

/** 조직 이미지 수정 */
export const patchOrgImage = async (orgId: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.patch(
      `/admin/org/${orgId}/orgs/info`,
      formData,
      {
        tokenType: "org",
      } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (err: any) {
    console.error("🚨 조직 이미지 수정 실패:", err);
    throw new Error(err.response?.data?.message || "조직 이미지 수정에 실패했습니다.");
  }
};

/** 조직 코드 재발급 */
export const regenerateOrgCode = async (orgId: number) => {
  try {
    const response = await api.patch(
      `/admin/org/${orgId}/orgs/code`,
      null,
      {
        tokenType: "org",
      } as CustomAxiosRequestConfig
    );

    return response.data.result.new_code;
  } catch (err: any) {
    console.error("🚨 조직 코드 재발급 실패:", err);
    throw new Error(err.response?.data?.message || "조직 코드 재발급 실패");
  }
};