import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { WatchedVideo } from "@/types/video";

/**
 * 영상 시청 기록 조회 (조직별 org_token 인증)
 * @param orgId 현재 선택된 조직의 ID
 */
export const getWatchedVideos = async (orgId: number): Promise<WatchedVideo[]> => {
  try {
    const orgToken = localStorage.getItem("org_token");
    const storedOrgId = localStorage.getItem("org_id");

    if (!orgToken || !storedOrgId) {
      throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
    }

    if (Number(storedOrgId) !== orgId) {
      console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
    }

    const response = await api.get(`/${orgId}/myactivity/video`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    const videos = response.data?.result?.videos || [];
    const mapped = videos.map((v: any) => ({
      ...v,
      img: v.img?.startsWith("http")
        ? v.img
        : `https://${v.img}`,
    }));

    return mapped;
  } catch (error: any) {
    console.error("🚨 영상 시청 기록 조회 중 오류:", error);
    const message =
      error.response?.data?.message ||
      "영상 시청 기록을 불러오는 중 오류가 발생했습니다.";
    throw new Error(message);
  }
};