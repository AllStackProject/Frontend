import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/**
 * 조직 생성 API
 * @param formData multipart/form-data (name, desc, nickname, img)
 */
export const createOrganization = async (formData: FormData) => {
  try {
    const response = await api.post(`/orgs`, formData, {
      tokenType: "user",
    } as CustomAxiosRequestConfig);

    const result = response.data?.result;
    if (result?.is_success) {
      return { success: true };
    } else {
      throw new Error(response.data?.message || "조직 생성에 실패했습니다.");
    }
  } catch (err: any) {
    console.error("🚨 조직 생성 실패:", err);
    throw new Error(err.response?.data?.message || "조직 생성 중 오류가 발생했습니다.");
  }
};

/** 조직명 중복 확인 */
export const checkOrgNameAvailability = async (name: string) => {
  try {
    const response = await api.get(`/orgs/availability`, {
      params: { name },
      tokenType: "user",
    } as CustomAxiosRequestConfig);

    return response.data?.result?.is_success === true;
  } catch (err: any) {
    console.error("🚨 조직명 중복 확인 실패:", err);
    throw new Error(err.response?.data?.message || "조직명 중복 확인 중 오류가 발생했습니다.");
  }
};