import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/* 홈 조회 */
export const fetchHomeVideos = async (orgId: number, filter: string) => {
  const res = await api.get(`/${orgId}/home`, {
    params: { filter },
    tokenType: "org",
  } as CustomAxiosRequestConfig);

  const result = res.data.result;

  result.videos = result.videos.map((v: any) => ({
    ...v,
    thumbnail_url: v.thumbnail_url.startsWith("http")
      ? v.thumbnail_url
      : `https://${v.thumbnail_url}`,
  }));

  return result;
};

/* 동영상 검색 */
export const fetchSearchVideos = async (orgId: number, keyword: string) => {
  try {
    const res = await api.get(`/${orgId}/home/search`, {
      params: { keyword },
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    const videos = res.data.result.videos;

    return videos.map((v: any) => ({
      ...v,
      thumbnail_url: v.thumbnail_url.startsWith("http")
        ? v.thumbnail_url
        : `https://${v.thumbnail_url}`,
    }));
  } catch (err: any) {
    console.error("❌ 영상 검색 실패:", err);
    throw new Error(err.response?.data?.message || "검색 실패");
  }
};