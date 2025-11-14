import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { AdminOrgVideoResponse } from "@/types/video";

// 조직 내 모든 영상 조회
export const getAdminOrgVideos = async (orgId: number) => {
  try {
    const response = await api.get(`/admin/org/${orgId}/video`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    const list = response.data?.result?.vidoes ?? [];
    return list as AdminOrgVideoResponse[];
  } catch (err: any) {
    console.error("🚨 조직 영상 조회 실패:", err);
    throw new Error(err.response?.data?.message || "조직 영상 조회에 실패했습니다.");
  }
};

// 조직 내 특정 동영상 삭제
export const deleteAdminOrgVideo = async (orgId: number, videoId: number) => {
  try {
     const response = await api.delete(`/admin/org/${orgId}/video/${videoId}`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return {
      success: response.data?.result?.is_success === true,
      message: response.data?.message || "",
    };
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "동영상 삭제 실패");
  }
};