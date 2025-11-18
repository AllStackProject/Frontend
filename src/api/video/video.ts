import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { StartVideoSessionResponse } from "@/types/video";

/**
 * 영상 시청 세션 시작 (조직별 org_token 인증)
 * @param orgId 조직 ID
 * @param videoId 비디오 ID
 */
export const startVideoSession = async (
    orgId: number,
    videoId: number
): Promise<StartVideoSessionResponse["result"]> => {
    try {
        const orgToken = localStorage.getItem("org_token");
        const storedOrgId = localStorage.getItem("org_id");

        if (!orgToken || !storedOrgId) {
            throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
        }

        if (Number(storedOrgId) !== orgId) {
            console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
        }

        const response = await api.post(
            `/${orgId}/video/${videoId}/join`,
            
            {},
            {
                tokenType: "org",
            } as CustomAxiosRequestConfig
        );
        
        return response.data.result;
    } catch (error: any) {
        console.error("🚨 영상 세션 시작 중 오류:", error);
        const message =
            error.response?.data?.message ||
            "영상 시청 세션을 시작하는 중 오류가 발생했습니다.";
        throw new Error(message);
    }
};

/** 비디오 시청 종료 API */
export const leaveVideoSession = async (
  orgId: number,
  videoId: number,
  payload: {
    session_id: string;
    watch_rate: number;
    watch_segments: string;
    recent_position: number;
    is_quit: boolean;
  }
) => {
  try {
    const response = await api.post(
      `/${orgId}/video/${videoId}/leave`,
      payload,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (err: any) {
    console.error("🚨 LEAVE API 실패", err);
  }
};