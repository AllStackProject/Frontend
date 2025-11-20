import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/* 홈 조회 */
export const fetchHomeVideos = async (orgId: number, filter: string) => {
  const res = await api.get(`/${orgId}/home`, {
    params: { filter },
    tokenType: "org",
  }as CustomAxiosRequestConfig);

  return res.data.result;
};

/* 동영상 검색 */
export const fetchSearchVideos = async (orgId: number, keyword: string) => {
  try {
    const res = await api.get(`/${orgId}/home/search`, {
      params: { keyword },
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    return res.data.result.videos;
  } catch (err: any) {
    console.error("❌ 영상 검색 실패:", err);
    throw new Error(err.response?.data?.message || "검색 실패");
  }
};