import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { HourWatchReport, DayWatchReport, GroupWatchRate } from "@/types/video";

/** 시간대별 조회수 조회 */
export async function fetchHourlyReport(
  orgId: number,
  standardMonth: string
): Promise<HourWatchReport> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/hour/${standardMonth}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (error: any) {
    console.error("❌ 시간대별 조회수 조회 실패:", error);

    throw new Error(
      error.response?.data?.message ||
        "시간대별 조회수 조회 중 오류가 발생했습니다."
    );
  }
}

/** 요일별 조회수 조회 */
export async function fetchDayReport(
  orgId: number,
  standardMonth: string
): Promise<DayWatchReport> {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/day/${standardMonth}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (error: any) {
    console.error("❌ 요일별 조회수 조회 실패:", error);

    throw new Error(
      error.response?.data?.message ||
        "요일별 조회수 조회 중 오류가 발생했습니다."
    );
  }
}

/* 그룹별 시청 완료율 조회 */
export async function fetchGroupWatchRate(
  orgId: number,
  standardMonth: string
): Promise<GroupWatchRate> {
  try {
    const res = await api.get(
      `/admin/org/${orgId}/report/watchRate/${standardMonth}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result;
  } catch (err: any) {
    console.error("❌ 그룹별 완료율 조회 실패:", err);
    throw new Error(
      err.response?.data?.message ||
        "그룹별 시청 완료율 조회 중 오류가 발생했습니다."
    );
  }
}

/* 인기 동영상 조회 */
export async function fetchTopRankVideos(orgId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/top-rank`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result.all_video_rank;
  } catch (error: any) {
    console.error("❌ 인기 동영상 TOP 조회 실패:", error);

    throw new Error(
      error.response?.data?.message ||
        "인기 동영상을 불러오는 중 오류가 발생했습니다."
    );
  }
}

/* 동영상별 시청 구간  조회 */

// 영상별 구간 분석 목록
export async function fetchIntervalList(orgId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/interval`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.all_video_interval;
  } catch (error: any) {
    console.error("❌ 구간 분석 목록 조회 실패:", error);
    throw new Error(error.response?.data?.message || "구간 분석 목록 조회 실패");
  }
}

// 중도 이탈 분석
export async function fetchQuitAnalysis(orgId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/quit`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result;
  } catch (error: any) {
    console.error("❌ 중도 이탈 분석 조회 실패:", error);
    throw new Error(error.response?.data?.message || "중도 이탈 분석 조회 실패");
  }
}

// 특정 영상의 구간 분석 상세
export async function fetchIntervalDetail(orgId: number, videoId: number) {
  try {
    const response = await api.get(
      `/admin/org/${orgId}/report/interval/${videoId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );
    return response.data.result.video_interval_log_items;
  } catch (error: any) {
    console.error("❌ 구간 상세 조회 실패:", error);
    throw new Error(error.response?.data?.message || "구간 상세 조회 실패");
  }
}