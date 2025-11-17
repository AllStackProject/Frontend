import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type {
    AdminOrgVideoWatchResponse,
    AdminOrgSingleVideoWatchResponse,
    AdminWatchedMember,
} from "@/types/video";

/* 영상별 시청 기록 목록 조회 */
export const fetchAdminOrgVideoWatchList = async (
    orgId: number
): Promise<AdminOrgVideoWatchResponse["result"]["all_video_watch"]> => {
    try {
        const response = await api.get<AdminOrgVideoWatchResponse>(
            `/admin/org/${orgId}/view/videos`,
            {
                tokenType: "org",
            } as CustomAxiosRequestConfig
        );

        return response.data.result.all_video_watch;
    } catch (error: any) {
        console.error("❌ 관리자 영상 시청 기록 목록 조회 실패:", error);
        throw new Error(
            error.response?.data?.message ||
            "관리자 영상 시청 기록 조회 중 오류가 발생했습니다."
        );
    }
};

/** 특정 영상의 시청 기록 조회 */
export const fetchAdminOrgSingleVideoWatch = async (
    orgId: number,
    videoId: number
): Promise<AdminWatchedMember[]> => {
    try {
        const response = await api.get<AdminOrgSingleVideoWatchResponse>(
            `/admin/org/${orgId}/view/video/${videoId}`,
            { tokenType: "org" } as CustomAxiosRequestConfig
        );

        return response.data.result.watched_members;
    } catch (error: any) {
        console.error("❌ 영상별 시청 기록 조회 실패:", error);
        throw new Error(
            error.response?.data?.message ||
            "영상별 시청 기록 조회 중 오류가 발생했습니다."
        );
    }
};