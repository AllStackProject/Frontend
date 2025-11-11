import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/**
 * 영상 스크랩 등록
 */
export const postVideoScrap = async (orgId: number, videoId: number): Promise<{ is_success: boolean }> => {
  try {
    const orgToken = localStorage.getItem("org_token");
    if (!orgToken) throw new Error("조직 토큰이 없습니다. 다시 로그인해주세요.");

    const response = await api.post(
      `/${orgId}/video/${videoId}/scrap`,
      {},
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data?.result || { is_success: false };
  } catch (error: any) {
    console.error("🚨 스크랩 등록 실패:", error);
    const message =
      error.response?.data?.message || "스크랩 등록 중 오류가 발생했습니다.";
    throw new Error(message);
  }
};

/**
 * 영상 스크랩 취소
 */
export const deleteVideoScrap = async (orgId: number, videoId: number): Promise<{ is_success: boolean }> => {
  try {
    const orgToken = localStorage.getItem("org_token");
    if (!orgToken) throw new Error("조직 토큰이 없습니다. 다시 로그인해주세요.");

    const response = await api.delete(`/${orgId}/video/${videoId}/scrap`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return response.data?.result || { is_success: false };
  } catch (error: any) {
    console.error("🚨 스크랩 취소 실패:", error);
    const message =
      error.response?.data?.message || "스크랩 취소 중 오류가 발생했습니다.";
    throw new Error(message);
  }
};