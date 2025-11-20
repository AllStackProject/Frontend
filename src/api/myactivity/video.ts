import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { MyVideoItem } from "@/types/video";

/** 내가 업로드한 영상 조회 */
export const fetchMyUploadedVideos = async (
  orgId: number
): Promise<MyVideoItem[]> => {
  try {
    const res = await api.get(`/${orgId}/myactivity/myvideo`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return res.data?.result?.vidoes || [];
  } catch (err: any) {
    console.error("❌ 내 영상 목록 조회 실패:", err);
    throw new Error(
      err.response?.data?.message || "내가 업로드한 영상 목록을 불러오지 못했습니다."
    );
  }
};

/* 내가 업로한 영상 통계 조회*/
export const fetchMyVideoStats = async (orgId: number, videoId: number) => {
  try {
    const res = await api.get(`/${orgId}/myactivity/myvideo/${videoId}`, {
      tokenType: "org",
    }as CustomAxiosRequestConfig);

    return res.data?.result?.video_interval_log_items || [];
  } catch (err: any) {
    console.error("❌ 영상 통계 조회 실패:", err);
    throw new Error("통계 정보를 불러오는 중 오류가 발생했습니다.");
  }
};