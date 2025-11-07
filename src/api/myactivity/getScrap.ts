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

    // org_token 또는 org_id 누락 시 오류 처리
    if (!orgToken || !storedOrgId) {
      throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
    }

    // 현재 로그인 중인 조직과 전달받은 orgId 일치 검증
    if (Number(storedOrgId) !== orgId) {
      console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
    }

    // API 호출 (org_token 인증)
    const response = await api.get(`/${orgId}/myactivity/scrap`, {
      tokenType: "org", 
    } as CustomAxiosRequestConfig);

    return response.data.result.all_scrap || [];
  } catch (error: any) {
    console.error("❌ [getScrapVideos] 오류:", error);
    throw new Error(error.response?.data?.message || "스크랩 목록을 불러오지 못했습니다.");
  }
}