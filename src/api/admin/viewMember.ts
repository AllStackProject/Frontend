import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type {
  MemberWatchSummary,
  MemberWatchDetail,
} from "@/types/video";

/** 전체 멤버 시청 요약 조회 */
export async function fetchAdminMemberWatchList(
  orgId: number
): Promise<MemberWatchSummary[]> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/view/members`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.all_member_watch;
  } catch (error: any) {
    console.error("❌ 관리자 멤버별 시청 요약 조회 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "관리자 멤버 시청 요약 조회 중 오류가 발생했습니다."
    );
  }
}

/** 특정 멤버 상세 조회 */
export async function fetchAdminMemberWatchDetail(
  orgId: number,
  memberId: number
): Promise<MemberWatchDetail[]> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/view/member/${memberId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.watched_videos;
  } catch (error: any) {
    console.error("❌ 관리자 특정 멤버 상세 조회 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "관리자 특정 멤버 시청 상세 조회 중 오류가 발생했습니다."
    );
  }
}