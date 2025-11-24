import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { ScrapVideo } from "@/types/scrap";

/**
 * 스크랩한 영상 목록 조회
 * @param orgId 조직 ID
 */
export async function getScrapVideos(orgId: number): Promise<ScrapVideo[]> {
  try {
    const orgToken = localStorage.getItem("org_token");
    const storedOrgId = localStorage.getItem("org_id");

    if (!orgToken || !storedOrgId) {
      throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
    }

    if (Number(storedOrgId) !== orgId) {
      console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
    }

    const response = await api.get(`/${orgId}/myactivity/scrap`, {
      tokenType: "org",
    } as CustomAxiosRequestConfig);

    const videos = response.data.result.all_scrap || [];
    const mapped = videos.map((v: any) => ({
      ...v,
      img: v.img?.startsWith("http")
        ? v.img
        : `https://${v.img}`,
    }));

    return mapped;

  } catch (error: any) {
    console.error("❌ [getScrapVideos] 오류:", error);
    throw new Error(error.response?.data?.message || "스크랩 목록을 불러오지 못했습니다.");
  }
}